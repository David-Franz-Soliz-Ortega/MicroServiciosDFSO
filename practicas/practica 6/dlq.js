import amqp from 'amqplib';

try {
    // 1. Conectar a RabbitMQ usando credenciales (por defecto guest:guest)
    // Si en tu docker-compose usaste otro usuario, cámbialo aquí.
    const conexion = await amqp.connect('amqp://admin:admin123@localhost');
    
    // 2. Crear el canal
    const canal = await conexion.createChannel();
    
    console.log("Configurando Exchanges y Colas...");

    // 3. Declarar Exchanges
    await canal.assertExchange("inscripciones", "direct", { durable: true });
    await canal.assertExchange("reintentos", "direct", { durable: true });

    // 4. Principal: lo que el consumidor rechaza se va al exchange de reintentos
    await canal.assertQueue("notificaciones.correo", {
        durable: true,
        deadLetterExchange: "reintentos",
    });
    await canal.bindQueue("notificaciones.correo", "inscripciones", "inscripcion.confirmada");

    // 5. Reintento: retiene 5 segundos y devuelve el mensaje a la cola principal
    await canal.assertQueue("notificaciones.reintento", {
        durable: true,
        messageTtl: 5000,
        deadLetterExchange: "inscripciones",
        deadLetterRoutingKey: "inscripcion.confirmada",
    });
    await canal.bindQueue("notificaciones.reintento", "reintentos", "inscripcion.confirmada");

    // 6. Muerta: nadie la consume automáticamente, la revisa una persona
    await canal.assertQueue("notificaciones.muertos", { durable: true });

    console.log("Configuración exitosa. Cerrando conexión...");
    
    // 7. Cerrar todo ordenadamente
    await canal.close();
    await conexion.close();

} catch (error) {
    console.error("Error al configurar RabbitMQ:", error);
}