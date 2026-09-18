const { MongoClient, ObjectId } = require("mongodb");

let col;

async function conectar() {
  const cliente = await new MongoClient(process.env.MONGO_URL).connect();
  col = cliente.db(process.env.MONGO_DB).collection("trabajadores");
  return cliente;
}

const aId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

async function listar(filtro = {}, orden = {}, pagina = 1, limite = 20) {
  const skip = (pagina - 1) * limite;
  const [datos, total] = await Promise.all([
    col.find(filtro).sort(orden).skip(skip).limit(limite).toArray(),
    col.countDocuments(filtro)
  ]);
  return { datos, total };
}

module.exports = {
  conectar,
  listar,
  crear: (u) => col.insertOne(u),
  obtener: (id) => (aId(id) ? col.findOne({ _id: aId(id) }) : null),
  porIds: async (ids) => {
    const objectIds = ids.map(id => aId(id)).filter(id => id != null);
    return await col.find({ _id: { $in: objectIds } }).toArray();
  },

  porCedula: (ci) => col.findOne({ cedula: ci }), 
  
  actualizar: (id, datos) => (aId(id) ? col.updateOne({ _id: aId(id) }, { $set: datos }) : null),
  borrar: (id) => (aId(id) ? col.deleteOne({ _id: aId(id) }) : null)
};