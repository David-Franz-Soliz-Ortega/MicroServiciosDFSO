const express = require("express");
const { validarReserva, haySolapamiento } = require("./horario");

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// publicar(clave, evento) se inyecta desde server.js: así las pruebas
// pueden pasar una función falsa (jest.fn) sin necesitar el broker.
function crearApp({ publicar = async () => {} } = {}) {
  const app = express();
  app.use(express.json());
  const reservas = [];
  let siguiente = 1;

  app.get("/salud", (_req, res) => res.json({ estado: "ok" }));

  app.get("/reservas", (_req, res) => res.json(reservas));

  app.post("/reservas", async (req, res) => {
    const { laboratorio, docente, correo, inicio, fin } = req.body || {};
    if (!laboratorio || !docente) {
      return res.status(400).json({ error: "laboratorio y docente son obligatorios" });
    }
    try {
      validarReserva(inicio, fin,
        Number(process.env.APERTURA || 7), Number(process.env.CIERRE || 22));
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const nueva = { laboratorio, docente, correo, inicio, fin };
    const choque = reservas.find((r) => r.laboratorio === laboratorio && haySolapamiento(r, nueva));
    if (choque) {
      return res.status(409).json({ error: "el horario choca con " + choque.id });
    }
    const reserva = { id: "RES-" + siguiente++, ...nueva, creadaEn: new Date().toISOString() };
    reservas.push(reserva);
    // TODO Tarea 2: publicar el evento ReservaConfirmada con la clave reserva.confirmada
    if(!choque){
        res.status(201).json(reserva);
    }
  
  });

  app.delete("/reservas/:id", async (req, res) => {
    const i = reservas.findIndex((r) => r.id === req.params.id);
    if (i === -1) return res.status(404).json({ error: "reserva no encontrada" });
    const [reserva] = reservas.splice(i, 1);
    // TODO Tarea 2: publicar el evento ReservaCancelada con la clave reserva.cancelada
    res.json({ ...reserva, cancelada: true });
  });

  // Simula una consulta lenta: la demora se controla con LATENCIA_MS (Tarea 3).
  app.get("/disponibilidad/:laboratorio", async (req, res) => {
    await esperar(Number(process.env.LATENCIA_MS || 0));
    const ocupadas = reservas.filter((r) => r.laboratorio === req.params.laboratorio);
    const libres = [];
    for (let h = 7; h < 22; h++) {
      if (!ocupadas.some((r) => h >= r.inicio && h < r.fin)) libres.push(h);
    }
    res.json({ laboratorio: req.params.laboratorio, horasLibres: libres });
  });

  return app;
}

module.exports = { crearApp };
