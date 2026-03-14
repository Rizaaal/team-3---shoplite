const mysql = require('mysql2');

// Crea il pool di connessioni
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'angular',
  port: '8889'
});

// Trasforma in promise per usare async/await
const db = pool.promise();

module.exports = db;
