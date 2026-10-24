require("dotenv").config(); 
const express = require("express");
const amqp = require("amqplib"); 
const { correlacion } = require("./correlacion");
const { cliente, duracion } = require("./metricas");

const app = express();
app.use(express.json());

// Middleware de metricas Prometheus
app.use((req, res, next) => {
  const fin = duracion.startTimer();
  res.on("finish", () =>
    fin({
      metodo: req.method,
      ruta: req.route ? req.route.path : req.path,
      codigo: res.statusCode,
    })
  );
  next();
});

// Middleware de correlacion y logs
app.use(correlacion);

// Ruta /metrics para Prometheus
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", cliente.register.contentType);
  res.end(await cliente.register.metrics());
});

const PORT = process.env.PORT || process.env.port || 3001;
const COLA = process.env.COLA; 
const LIMITE = 3; 

const cupos = { "COM-600": 30 };
const procesados = new Set(); 

// Rutas HTTP para Practica 10
app.get("/salud", (req, res) => {
  req.registro.info("Consulta de salud");
  res.json({ estado: "ok", servicio: "notificaciones" });
});

app.post("/avisos", (req, res) => {
  req.registro.info({ aviso: req.body }, "aviso recibido");
  res.status(200).json({ estado: "recibido" });
});

function descontarCupo(evento) {
  cupos[evento.curso] = (cupos[evento.curso] ?? 30) - 1;
}

async function enviarCorreo(evento) { 
  await new Promise((r) => setTimeout(r, 1500)); 
}

async function main() {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[servidor] Notificaciones escuchando en http://0.0.0.0:${PORT}`);
  });

  if (!process.env.RABBITMQ_URL || !COLA) {
    console.log("[notificaciones] RABBITMQ_URL o COLA no definidos. Modo solo HTTP.");
    return;
  }

  try {
    const conexion = await amqp.connect(process.env.RABBITMQ_URL); 
    const canal = await conexion.createChannel(); 
    
    await canal.assertQueue(COLA, { 
      durable: true,
      deadLetterExchange: "reintentos" 
    }); 
    
    canal.prefetch(1); 
    
    canal.consume(COLA, (mensaje) => { 
      if (mensaje === null) return;

      const headers = mensaje.properties.headers || {};
      const muertes = headers["x-death"]; 
      const intentos = muertes ? muertes[0].count : 0; 
      
      if (intentos >= LIMITE) { 
        canal.sendToQueue("notificaciones.muertos", mensaje.content, { persistent: true }); 
        return canal.ack(mensaje); 
      } 
      
      try { 
        procesar(JSON.parse(mensaje.content.toString())); 
        canal.ack(mensaje); 
      } catch (e) { 
        canal.nack(mensaje, false, false); 
      } 
    }, { noAck: false });
  } catch (err) {
    console.error("[rabbitmq] Advertencia al conectar con RabbitMQ:", err.message);
  }
} 

function procesar(evento) { 
  if (!evento.correo || !evento.correo.includes("@")) { 
    throw new Error("correo invalido: " + evento.correo); 
  } 

  if (procesados.has(evento.id)) {
    return;
  }

  procesados.add(evento.id);
  descontarCupo(evento);
}

main().catch((e) => { 
  console.error(e.message); 
  process.exit(1); 
});
