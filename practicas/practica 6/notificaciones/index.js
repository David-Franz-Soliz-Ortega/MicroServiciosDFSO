require("dotenv").config(); 
const amqp = require("amqplib"); 

const COLA = process.env.COLA; 
const LIMITE = 3; 

const cupos = { "COM-600": 30 };
// 1. Creamos una memoria para guardar los IDs que ya procesamos
const procesados = new Set(); 

function descontarCupo(evento) {
  cupos[evento.curso] = (cupos[evento.curso] ?? 30) - 1;
  console.log("[cupos]", evento.curso, "quedan", cupos[evento.curso]);
}

async function enviarCorreo(evento) { 
  console.log("[correo] enviando a", evento.correo, "por", evento.id); 
  await new Promise((r) => setTimeout(r, 1500)); 
  console.log("[correo] enviado a", evento.correo); 
}

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL); 
  const canal = await conexion.createChannel(); 
  
  await canal.assertQueue(COLA, { 
    durable: true,
    deadLetterExchange: "reintentos" 
  }); 
  
  canal.prefetch(1); 
  console.log("[correo] esperando mensajes en", COLA); 
  
  canal.consume(COLA, (mensaje) => { 
    if (mensaje === null) return;

    const headers = mensaje.properties.headers || {};
    const muertes = headers["x-death"]; 
    const intentos = muertes ? muertes[0].count : 0; 
    
    if (intentos >= LIMITE) { 
      console.error("[correo] sin mas intentos: a la cola muerta"); 
      canal.sendToQueue("notificaciones.muertos", mensaje.content, { persistent: true }); 
      return canal.ack(mensaje); 
    } 
    
    try { 
      procesar(JSON.parse(mensaje.content.toString())); 
      canal.ack(mensaje); 
    } catch (e) { 
      console.error("[correo] intento", intentos + 1, "fallido:", e.message); 
      canal.nack(mensaje, false, false); 
    } 
  }, { noAck: false });
} 

function procesar(evento) { 
  if (!evento.correo || !evento.correo.includes("@")) { 
    throw new Error("correo invalido: " + evento.correo); 
  } 

  // 2. VERIFICACIÓN DE IDEMPOTENCIA
  if (procesados.has(evento.id)) {
    console.log("[correo] ignorando evento repetido:", evento.id);
    return; // Salimos de la función sin descontar el cupo
  }

  // Si es nuevo, lo registramos en nuestra memoria
  procesados.add(evento.id);

  console.log("[correo] bienvenida enviada a", evento.correo); 
  descontarCupo(evento);
}

main().catch((e) => { 
  console.error(e.message); 
  process.exit(1); 
});