const pino = require("pino");
const fs = require("fs");
const path = require("path");

const servicio = process.env.SERVICIO || "notificaciones";

const dirRegistrosLocal = path.resolve("./registros");
if (!fs.existsSync(dirRegistrosLocal)) {
  fs.mkdirSync(dirRegistrosLocal, { recursive: true });
}

const dirRegistrosP10 = path.resolve("../practica 10/registros");
if (fs.existsSync(path.resolve("../practica 10")) && !fs.existsSync(dirRegistrosP10)) {
  fs.mkdirSync(dirRegistrosP10, { recursive: true });
}

const streams = [
  { stream: process.stdout },
  { stream: pino.destination("./registros/" + servicio + ".log") },
];

if (fs.existsSync(path.resolve("../practica 10/registros"))) {
  streams.push({ stream: pino.destination("../practica 10/registros/" + servicio + ".log") });
}

const destinos = pino.multistream(streams);

const registro = pino(
  {
    level: process.env.NIVEL_LOG || "info",
    base: { servicio, entorno: process.env.ENTORNO || "laboratorio" },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: { level: (etiqueta) => ({ nivel: etiqueta }) },
  },
  destinos
);

module.exports = { registro };
