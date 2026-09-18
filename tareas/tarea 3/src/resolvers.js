const { GraphQLScalarType, Kind } = require('graphql');
const { listar, obtener, crear, actualizar, borrar, porCedula } = require('./repositorio');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Tipo de dato personalizado para Fechas',
  serialize(value) {
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  },
});

const resolvers = {

  Date: dateScalar,

  Query: {
    obtenerTrabajadores: async (_, { pagina = 1, limite = 20 }) => {
      const { datos } = await listar({}, {}, pagina, limite);
      return datos;
    },
    
    obtenerTrabajador: async (_, { id }, { cargadores }) => {
   
      if (cargadores && cargadores.trabajadorPorId) {
        return await cargadores.trabajadorPorId.load(id);
      }
      return await obtener(id);
    }
  },

  Trabajador: {
    /* 
     * Actualmente tu esquema es "plano", pero si en el futuro un trabajador
     * pertenece a un departamento que está en otra base de datos, o tiene "tareas",
     * aquí usarías los cargadores (DataLoader) o harías los fetch a otros microservicios.
     * 
     * Ejemplo hipotético:
     * tareas: (trabajador, _, { cargadores }) => cargadores.tareasPorTrabajador.load(trabajador._id),
     */
  },


  Mutation: {
    crearTrabajador: async (_, { input }) => {
    
      const existente = await porCedula(input.cedula);
      if (existente) throw new Error("La cédula ya está registrada");
      
      const resultado = await crear(input);
  
      return { _id: resultado.insertedId, ...input };
    },

    actualizarTrabajador: async (_, { id, input }) => {

      const resultado = await actualizar(id, input);

      if (!resultado || resultado.matchedCount === 0) {
        throw new Error("Trabajador no encontrado");
      }

      return await obtener(id);
    },

    eliminarTrabajador: async (_, { id }) => {
      const resultado = await borrar(id);
      
      if (!resultado || resultado.deletedCount === 0) {
        throw new Error("Trabajador no encontrado");
      }
      return true;
    }
  }
};

module.exports = resolvers;