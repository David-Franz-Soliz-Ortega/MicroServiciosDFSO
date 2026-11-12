// Tarea 1.4 y Tarea 2: construir los eventos que se publican.
// Deben cumplir los contratos de la carpeta contratos/.
function construirEvento(tipo, reserva) {
  // TODO: completar
  return {
    "idEvento": crypto.randomUUID(),
    "tipo": tipo,
    "reservaId": crypto.randomUUID(),
    "laboratorio": reserva.laboratorio,
    "docente": reserva.docente,
    "correo": reserva.correo,
    "inicio": "number",
    "fin": "number",
    "ocurridoEn": "string"
  };
}

module.exports = { construirEvento };
