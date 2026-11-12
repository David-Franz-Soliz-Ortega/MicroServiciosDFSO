// Reglas de negocio de las reservas de laboratorios (ver el enunciado, Tarea 1).
// Las horas son enteras (formato 24 h).
//  - El laboratorio atiende de APERTURA a CIERRE (por omisión 7 a 22).
//  - Una reserva dura entre 1 y 4 horas y fin debe ser mayor que inicio.
//    Si no se cumple: Error("horario invalido").
//  - Dos reservas del mismo laboratorio chocan si sus intervalos se superponen.
//    Reservas contiguas NO chocan: 8-10 y 10-12 son válidas a la vez.
const DURACION_MAXIMA = 4;

function validarReserva(inicio, fin, apertura = 7, cierre = 22) {
  const valido = Number.isInteger(inicio) && Number.isInteger(fin)
    && inicio >= apertura && fin <= cierre
    && fin > inicio && fin - inicio <= DURACION_MAXIMA;
  if (!valido) throw new Error("horario invalido");
}

function haySolapamiento(a, b) {
  return a.inicio <= b.fin && b.inicio <= a.fin;
}

module.exports = { validarReserva, haySolapamiento, DURACION_MAXIMA };
