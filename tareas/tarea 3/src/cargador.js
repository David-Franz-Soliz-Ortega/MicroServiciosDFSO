// cargador.js
const DataLoader = require('dataloader');
const { porIds } = require('./repositorio');

function crearCargadores() {
  const trabajadorPorId = new DataLoader(async (ids) => {
    // 1. Buscamos todos los trabajadores de una sola vez en la BD
    const trabajadores = await porIds(ids);
    
    // 2. DataLoader exige que la respuesta tenga el mismo orden exacto que los 'ids' solicitados
    const mapa = trabajadores.reduce((acc, t) => {
      acc[t._id.toString()] = t;
      return acc;
    }, {});

    return ids.map(id => mapa[id] || null);
  });

  return { trabajadorPorId };
}

module.exports = { crearCargadores };