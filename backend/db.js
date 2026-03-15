const mysql = require('mysql2');

// Crea il pool di connessioni
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'shoplite',
  port: process.env.DB_PORT || 8889,
});

// Trasforma in promise per usare async/await
const db = pool.promise();

module.exports = db;
