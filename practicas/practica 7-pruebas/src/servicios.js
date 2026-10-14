
function publicarEventoRegistro(id, email) {
  return {
    usuarioId: id, 
    email: email,
    fecha: new Date().toISOString()
  };
}

function procesarEventoRegistro(evento) {
  if (!evento.email || !evento.usuarioId) throw new Error("Mensaje inválido");
  return `Correo de bienvenida enviado a ${evento.email}`;
}

module.exports = { publicarEventoRegistro, procesarEventoRegistro };