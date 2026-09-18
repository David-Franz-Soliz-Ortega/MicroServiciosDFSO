const typeDefs = `#graphql
  
  scalar Date

  type Trabajador {
    _id: ID!
    nombre: String!
    apellido: String!
    cedula: String!
    cargo: String!
    departamento: String!
    fechaIngreso: Date!
  }

  input TrabajadorInput {
    nombre: String!
    apellido: String!
    cedula: String!
    cargo: String!
    departamento: String!
    fechaIngreso: Date!
  }

  input TrabajadorUpdateInput {
    nombre: String
    apellido: String
    cedula: String
    cargo: String
    departamento: String
    fechaIngreso: Date
  }

  type Query {
    obtenerTrabajadores(pagina: Int, limite: Int): [Trabajador]
    obtenerTrabajador(id: ID!): Trabajador
  }

  type Mutation {
    crearTrabajador(input: TrabajadorInput!): Trabajador
    actualizarTrabajador(id: ID!, input: TrabajadorUpdateInput!): Trabajador
    eliminarTrabajador(id: ID!): Boolean
  }
`;

module.exports = typeDefs;