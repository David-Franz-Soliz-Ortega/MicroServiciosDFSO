const express= require("express");
const dotenv = require('dotenv');
const  typeDefs  = require('./esquema'); 
const { crearCargadores } = require('./cargador');
const resolvers = require("./resolvers");
const { ApolloServer } = require('@apollo/server'); 
const { startStandaloneServer } = require('@apollo/server/standalone'); 
const depthLimit = require('graphql-depth-limit');
const { conectar,listar,crear, actualizar, borrar} = require('./repositorio');
const app=express();
dotenv.config();

const port=process.env.PORT;

async function main() { 
 


  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
     
    validationRules: [depthLimit(1)],
    formatError: (err) => { 
      console.error('[GraphQL]', err); 
      return { 
        message: err.message, 
        code: err.extensions && err.extensions.code, 
        path: err.path, 
      }; 
    }, 
  });

  const { url } = await startStandaloneServer(server, { 
    listen: { port: 3000 },
    context: async () => ({ cargadores: crearCargadores() }), 
  }); 
  
  console.log('GraphQL escuchando en ' + url); 
}

main();



app.get("/salud",(req,res)=>{
    res.send("Deberias ver esto");
});

app.get("/trabajador",async(req,res)=>{
    try{
         const pagina=parseInt(req.query.pagina);
         const limite=parseInt(req.query.limite);
         const resultado = await listar({}, {}, pagina, limite);
    res.json(resultado);
    }catch(error){
        console.error(error);
    res.status(500).json({ error: 'Error al obtener los trabajadores' });
    }
   
});

app.post("/trabajador", async (req, res) => {
  try {
    const errores = validarTrabajador(req.body);
    if (errores.length) {
      return fallo(res, 400, "VALIDACION", "La solicitud tiene campos inválidos", errores);
    }

    // Extraemos los campos correctos
    const { nombre, apellido, cedula, cargo, departamento, fechaIngreso } = req.body;

    // Verificamos que la cédula no esté duplicada
    const existente = await porCedula(cedula);
    if (existente) {
      return fallo(res, 409, "CONFLICTO", "La cédula de identidad ya está registrada");
    }

    // Creamos el objeto con la estructura correcta
    const nuevoTrabajador = { nombre, apellido, cedula, cargo, departamento, fechaIngreso };
    const resultado = await crear(nuevoTrabajador);
    
    res.status(201)
       .location(`/trabajador/${resultado.insertedId}`)
       .json({ _id: resultado.insertedId, ...nuevoTrabajador });

  } catch (err) {
    console.error(err);
    fallo(res, 500, "ERROR_INTERNO", "Error al crear el trabajador");
  }
});

app.put("/trabajador/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const { nombre, apellido, cedula, cargo, departamento, fechaIngreso } = req.body;
    
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellido) datosActualizados.apellido = apellido;
    if (cedula) datosActualizados.cedula = cedula;
    if (cargo) datosActualizados.cargo = cargo;
    if (departamento) datosActualizados.departamento = departamento;
    if (fechaIngreso) datosActualizados.fechaIngreso = fechaIngreso;

    if (Object.keys(datosActualizados).length === 0) {
      return fallo(res, 400, "MAL_FORMADO", "No se enviaron datos válidos para actualizar");
    }

    const resultado = await actualizar(id, datosActualizados);

    if (!resultado || resultado.matchedCount === 0) {
      return fallo(res, 404, "NO_ENCONTRADO", "Trabajador no encontrado o ID inválido");
    }
    res.json({ 
        mensaje: "Trabajador actualizado exitosamente", 
        _id: id,...datosActualizados 
    });
  } catch (err) {
    console.error(err);
    fallo(res, 500, "ERROR_INTERNO", "Error al actualizar el trabajador");
  }
});

app.delete("/trabajador/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const resultado = await borrar(id);

    if (!resultado || resultado.deletedCount === 0) {
      return fallo(res, 404, "NO_ENCONTRADO", "Trabajador no encontrado o ID inválido");
    }
    res.status(204).end();
    
  } catch (err) {
    console.error(err);
    fallo(res, 500, "ERROR_INTERNO", "Error al eliminar el trabajador");
  }
});




conectar().then(()=>{
    app.listen(port,()=>{
        console.log(`Escuchando en http://localhost:${port}`);
        console.log(`conexion a mongodb: ${process.env.MONGO_DB} `);
    })
}).catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});