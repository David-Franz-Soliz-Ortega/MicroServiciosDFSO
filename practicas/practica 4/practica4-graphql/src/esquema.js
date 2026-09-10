const typeDefs = `#graphql 
  type DetalleVenta { 
    id: Int! 
    producto: String! 
    cantidad: Int! 
    precioUnitario: Float! 
  } 

  type Venta { 
    id: Int! 
    fecha: String! 
    total: Float! 
    detalle: [DetalleVenta!]!
    # AGREGADOS PARA QUE COINCIDAN CON TUS RESOLVERS:
    clienteId: Int
    cliente: Cliente
  } 

  type Cliente { 
    id: Int! 
    nombre: String! 
    email: String 
  } 

  type Query { 
    ventas: [Venta!]! 
    venta(id: Int!): Venta 
  } 

  # AGREGADOS: Tipos de entrada para la mutación crearVenta
  input DetalleInput {
    producto: String!
    cantidad: Int!
    precioUnitario: Float!
  }

  input CrearVentaInput {
    clienteId: Int!
    fecha: String!
    detalle: [DetalleInput!]!
  }

  # AGREGADO: El bloque de mutaciones que programaste en tus resolvers
  type Mutation {
    crearVenta(input: CrearVentaInput!): Venta
    cambiarCantidad(detalleId: Int!, cantidad: Int!): DetalleVenta
  }
`;

module.exports = { typeDefs };