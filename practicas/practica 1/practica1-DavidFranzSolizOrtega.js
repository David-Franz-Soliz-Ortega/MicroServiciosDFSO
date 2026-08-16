// B1
db.productos.find({ categoria: { $in: [2, 7] } }, { nombre: 1, precio: 1, _id: 0 })

// B2
db.productos.find({ precio: { $gte: 100, $lte: 300 } })

// B3
db.productos.find({ activo: false })

// B4
db.productos.find({ nombre: /^[AC]/ })

// B5
db.productos.find({ variantes: { $exists: true } })

// B6
db.productos.find({ stock_minimo: { $type: "string" } })

// B7
db.productos.find({}, { nombre: 1, stock: 1, _id: 0 }).sort({ stock: -1 }).limit(4)

// B8
db.productos.find().sort({ nombre: 1 }).skip(4).limit(4)

// B9
db.productos.find({ etiquetas: { $in: ["organico", "artesania"] } })

// B10
db.productos.find({ categorias: { $size: 1 } })

// B11
db.productos.find({ "inventario.almacen": "La Paz", "inventario.cantidad": { $lt: 10 } })
db.productos.find({ inventario: { $elemMatch: { almacen: "La Paz", cantidad: { $lt: 10 } } } })

// B12
db.productos.find({ "categorias.0": 1 })

// B13
db.productos.find({ registrado: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } })

// B14
db.productos.countDocuments({ activo: true })

// B15
db.pedidos.find({ ciudad: "Sucre", total: { $gt: 300 } })

// B16
db.pedidos.find({ "items.codigo": "ALM-005" })

// B17
db.pedidos.find({ "items.1": { $exists: true } })

// B18
db.pedidos.distinct("cliente")

// B19
db.productos.insertOne({
  codigo: "NUEVO-001",
  nombre: "Sal de Uyuni 1kg",
  precio: 25,
  stock: 50,
  etiquetas: [ "sal", "condimento", "uyuni" ],
  medidas: { alto: 10, ancho: 10, unidad: "cm" },
  inventario: [ { almacen: "La Paz", cantidad: 30 }, { almacen: "Oruro", cantidad: 20 } ]
})

// B20
db.productos.insertMany([
  { codigo: "NUEVO-002", nombre: "Miel pura", precio: 30, stock: 15 },
  { codigo: "NUEVO-003", nombre: "Mermelada", precio: 20, stock: 10 },
  { codigo: "NUEVO-004", nombre: "Queso de oveja", precio: 40, stock: 5 }
])

// B21
db.pedidos.insertOne({
  _id: 7,
  cliente: "Martin Gómez",
  ciudad: "Tarija",
  estado: "pendiente",
  items: [
    { codigo: "BEB-004", cantidad: 2, precio: 95 },
    { codigo: "NUEVO-001", cantidad: 1, precio: 25 }
  ],
  total: 215,
  fecha: new Date()
})

// B22
db.productos.insertOne({ codigo: "TEX-999", nombre: "Gorro de lana", stock: 10 })
db.productos.countDocuments({ precio: { $exists: false } })


// B23
db.productos.updateMany({ categoria: 4 }, { $mul: { precio: 1.1 } })
db.productos.find({ codigo: "TEX-012" })

// B24
db.pedidos.updateMany({ estado: "enviado" }, { $set: { estado: "entregado" }, $currentDate: { fecha_entrega: true } })

// B25
db.productos.updateMany({ activo: false }, { $addToSet: { etiquetas: "liquidacion" } })

// B26
db.productos.updateMany({ stock_minimo: { $type: "string" } }, { $unset: { stock_minimo: "" } })
db.productos.countDocuments({ stock_minimo: { $type: "string" } })

// B27
db.productos.updateOne({ codigo: "ALM-011" }, { $push: { inventario: { almacen: "Camiri", cantidad: 5 } } })

// B28
db.productos.updateOne({ codigo: "BEB-030" }, { $set: { nombre: "Bebida misteriosa", precio: 40, stock: 25 } }, { upsert: true })

// B29
db.pedidos.countDocuments({ estado: "cancelado" })
db.pedidos.deleteMany({ estado: "cancelado" })

// B30
db.productos.deleteOne({ etiquetas: "textil" })

// B31
db.productos.deleteMany({ stock: { $lt: 5 } })

//32
load("seed.js")
db.productos.countDocuments()
db.pedidos.countDocuments()