require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5436', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ms_padron'
});

const initDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS facultades (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL UNIQUE,
      sigla VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS carreras (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL UNIQUE,
      facultad_id INT NOT NULL REFERENCES facultades(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS elecciones (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL UNIQUE,
      fecha DATE NOT NULL,
      estado VARCHAR(30) DEFAULT 'PROGRAMADA'
    );

    CREATE TABLE IF NOT EXISTS electores (
      id SERIAL PRIMARY KEY,
      ci VARCHAR(20) NOT NULL UNIQUE,
      nombres VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      carrera_id INT REFERENCES carreras(id) ON DELETE SET NULL,
      habilitado BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS candidatos (
      id SERIAL PRIMARY KEY,
      eleccion_id INT NOT NULL REFERENCES elecciones(id) ON DELETE CASCADE,
      elector_id INT NOT NULL REFERENCES electores(id) ON DELETE CASCADE,
      cargo VARCHAR(80) NOT NULL,
      partido_frente VARCHAR(100) NOT NULL,
      CONSTRAINT uq_candidato UNIQUE (eleccion_id, elector_id)
    );

    INSERT INTO facultades (nombre, sigla)
    VALUES 
      ('Facultad de Tecnologia', 'FT'),
      ('Facultad de Medicina', 'FM')
    ON CONFLICT (nombre) DO NOTHING;

    INSERT INTO carreras (nombre, facultad_id)
    VALUES 
      ('Ingenieria de Sistemas', (SELECT id FROM facultades WHERE sigla = 'FT' LIMIT 1)),
      ('Medicina General', (SELECT id FROM facultades WHERE sigla = 'FM' LIMIT 1))
    ON CONFLICT (nombre) DO NOTHING;

    INSERT INTO elecciones (nombre, fecha, estado)
    VALUES ('Elecciones FUL 2026', '2026-11-20', 'PROGRAMADA')
    ON CONFLICT (nombre) DO NOTHING;

    INSERT INTO electores (ci, nombres, apellidos, carrera_id, habilitado)
    VALUES 
      ('12345678', 'Juan Carlos', 'Perez Rodriguez', (SELECT id FROM carreras WHERE nombre = 'Ingenieria de Sistemas' LIMIT 1), TRUE),
      ('87654321', 'Maria Elena', 'Gomez Lopez', (SELECT id FROM carreras WHERE nombre = 'Medicina General' LIMIT 1), TRUE)
    ON CONFLICT (ci) DO NOTHING;

    INSERT INTO candidatos (eleccion_id, elector_id, cargo, partido_frente)
    VALUES (
      (SELECT id FROM elecciones WHERE nombre = 'Elecciones FUL 2026' LIMIT 1),
      (SELECT id FROM electores WHERE ci = '12345678' LIMIT 1),
      'Presidente FUL',
      'Frente Estudiantil Unidos'
    )
    ON CONFLICT (eleccion_id, elector_id) DO NOTHING;
  `);
};

module.exports = {
  pool,
  initDatabase
};
