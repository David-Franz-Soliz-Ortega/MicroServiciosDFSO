function construirEventoTareaCreada(tarea) {
  return {
    id: tarea.id,
    titulo: tarea.titulo,
    creadaEn: new Date().toISOString() // Debe ser un string según el contrato
  };
}

module.exports = { construirEventoTareaCreada };