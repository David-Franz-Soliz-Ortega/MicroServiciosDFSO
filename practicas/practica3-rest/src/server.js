const app = require('./app');
const dotenv = require('dotenv');
const { conectar } = require('./repositorio');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/usuarios/:id/expediente', (req, res) => {
  const ci = req.params.id;

  
  clienteGrpc.ObtenerEstudiante({ ci: ci }, (error, respuesta) => {
    
    if (error) {
      if (error.code === 5) {
        return res.status(404).json({ error: "Expediente de estudiante no encontrado" });
      }
      
      if (error.code === 14) {
        return res.status(503).json({ error: "El servicio interno de expedientes está caído" });
      }

      return res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }


    res.json(respuesta);
  });
});


// Conectar a MongoDB antes de iniciar el servidor
conectar().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Conectado a MongoDB: ${process.env.MONGO_DB}`);
  });
}).catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});