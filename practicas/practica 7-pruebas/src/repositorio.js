const { MongoClient } = require("mongodb");

async function crearRepositorio(uri) {
  const cliente = await new MongoClient(uri).connect();
  const col = cliente.db("practica7").collection("tareas");
  
  return {
    guardar: (t) => col.insertOne(t),
    buscarPorTitulo: (titulo) => col.findOne({ titulo }),
    actualizar: (titulo, completada) => col.updateOne({ titulo }, { $set: { completada } }),
    eliminar: (titulo) => col.deleteOne({ titulo }),
    limpiar: () => col.deleteMany({}), // Necesario para aislamiento
    cerrar: () => cliente.close()
  };
}

module.exports = { crearRepositorio };