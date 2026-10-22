require('dotenv').config();
const express = require('express');
const { pool, initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/salud', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    return res.status(200).json({
      estado: 'ok',
      microservicio: 'ms-padron',
      puerto: PORT,
      base_de_datos: {
        conectado: true,
        servidor_hora: result.rows[0].now
      }
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      microservicio: 'ms-padron',
      puerto: PORT,
      base_de_datos: {
        conectado: false,
        detalle: error.message
      }
    });
  }
});

const start = async () => {
  try {
    await initDatabase();
    console.log('PostgreSQL conectado y tablas verificadas/creadas con exito.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor ms-padron escuchando en http://localhost:${PORT}`);
  });
};

start();
