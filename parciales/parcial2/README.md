# reservas-api — Kit base del Examen Práctico COM-600 (Segundo Parcial 2/2026 · Versión B)

Servicio de reservas de los laboratorios de computación de la Facultad de Tecnología.

```bash
npm install          # instala express, jest y supertest
npm start            # API en http://localhost:3000
```

| Ruta | Qué hace |
|---|---|
| GET    /salud | `{ "estado": "ok" }` (para las sondas de Kubernetes) |
| GET    /reservas | lista las reservas |
| POST   /reservas | `{ laboratorio, docente, correo, inicio, fin }` (horas enteras) → 201 / 400 / 409 |
| DELETE /reservas/:id | cancela la reserva → 200 / 404 |
| GET    /disponibilidad/:laboratorio | horas libres del día; demora `LATENCIA_MS` milisegundos |

Variables: `APERTURA` y `CIERRE` (horario del laboratorio, 7 y 22 por omisión), `LATENCIA_MS`, `RABBITMQ_URL`.
Archivos con `TODO`: `src/app.js`, `src/server.js`, `src/eventos.js`.
`src/horario.js` tiene un defecto a propósito: encuéntrelo con una prueba (Tarea 1).
