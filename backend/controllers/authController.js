const bcrypt = require('bcrypt');
const { findClienteByEmail } = require('../services/authService');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email e password sono obbligatorie', 400);
    }

    const cliente = await findClienteByEmail(email);

    if (!cliente) {
      return sendError(res, 'client error: unauthorized', 401);
    }

    const passwordValida = await bcrypt.compare(password, cliente.password);

    if (!passwordValida) {
      return sendError(res, 'client error: unauthorized', 401);
    }

    const token = generateToken(cliente);

    return sendSuccess(res, {
      token,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        cognome: cliente.cognome,
        email: cliente.email,
        role: cliente.role,
        indirizzo: cliente.indirizzo,
      },
    });
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't login user", 500);
  }
};

module.exports = {
  login,
};
