const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Pool } = require('pg');


const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '123',
  database: 'medicos',
  port: 5432,
});


const PROTO_PATH = path.join(__dirname, '/proto/medicos.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const clinicaProto = grpc.loadPackageDefinition(packageDefinition).clinica.medicos.v1;


const servicioMedicosHandlers = {
  ObtenerMedico: async (call, callback) => {
    try {
      const { medico_id } = call.request;
      const result = await pool.query('SELECT id::text AS medico_id, nombre, especialidad, matriculaunica FROM medicos WHERE id = $1', [medico_id]);
      
      if (result.rows.length === 0) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Médico no encontrado' });
      }
      callback(null, result.rows[0]);
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  ListarMedico: async (call, callback) => {
    try {
      const { limit = 10, offset = 0 } = call.request;
      const result = await pool.query('SELECT id::text AS medico_id, nombre, especialidad, matriculaunica FROM medicos LIMIT $1 OFFSET $2', [limit, offset]);
      callback(null, { medicos: result.rows });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  ListarHorariosDisponible: async (call, callback) => {
    try {
      const { medico_id, fecha } = call.request;
      const result = await pool.query(
        `SELECT id::text AS horario_id, hora::text AS hora_inicio, hora::text AS hora_fin, disponible 
         FROM horarios 
         WHERE id_medico = $1 AND fecha = $2 AND disponible = TRUE`,
        [medico_id, fecha]
      );
      callback(null, { horarios: result.rows });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },


  ReservarHorario: async (call, callback) => {
    const { horario_id, paciente_id } = call.request;
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const slotCheck = await client.query(
        'SELECT disponible FROM horarios WHERE id = $1 FOR UPDATE',
        [horario_id]
      );

      if (slotCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return callback(null, { exito: false, mensaje: 'El horario no existe' });
      }

      if (!slotCheck.rows[0].disponible) {
        await client.query('ROLLBACK');
        return callback(null, { exito: false, mensaje: 'El horario ya se encuentra reservado' });
      }

      await client.query(
        'UPDATE horarios SET disponible = FALSE, paciente_id = $1 WHERE id = $2',
        [paciente_id, horario_id]
      );

      await client.query('COMMIT');
      callback(null, { exito: true, mensaje: 'Horario reservado exitosamente de forma atómica' });
    } catch (err) {
      await client.query('ROLLBACK');
      callback({ code: grpc.status.INTERNAL, message: err.message });
    } finally {
      client.release();
    }
  },

  LiberarHorario: async (call, callback) => {
    const { horario_id } = call.request;
    try {
      const result = await pool.query(
        'UPDATE horarios SET disponible = TRUE, paciente_id = NULL WHERE id = $1 RETURNING id',
        [horario_id]
      );

      if (result.rows.length === 0) {
        return callback(null, { exito: false, mensaje: 'Horario no encontrado' });
      }

      callback(null, { exito: true, mensaje: 'Horario liberado correctamente' });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },
};

function main() {
  const server = new grpc.Server();
  server.addService(clinicaProto.ServicioMedicos.service, servicioMedicosHandlers);

  const HOST_PORT = '0.0.0.0:50051';
  server.bindAsync(HOST_PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error al iniciar servidor gRPC:', err);
      return;
    }
    console.log(`Servidor gRPC corriendo en ${HOST_PORT}`);
    server.start();
  });
}

main();