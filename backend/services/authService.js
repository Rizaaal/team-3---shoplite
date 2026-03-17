const db = require('../config/db');

const findClienteByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT 
      id_cliente,
      nome,
      cognome,
      email,
      password,
      role,
      indirizzo,
      created_at
    FROM clienti
    WHERE email = ?
    LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
};

module.exports = {
  findClienteByEmail,
};
