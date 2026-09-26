const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123',
  database: 'pacientes',
  port: 3003,
  waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true, 
    keepAliveInitialDelay: 0,
  authPlugins: {
    mysql_native_password: () => () => Buffer.from('123')
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    return;
  }
  console.log('¡Conectado exitosamente a MySQL en Docker!');
});

module.exports = connection.promise();