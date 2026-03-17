const {
  getAllClienti,
  getClienteById,
  createCliente,
  deleteClienteById,
} = require('../services/clientiService');
const { sendSuccess, sendError } = require('../utils/response');

const getClienti = async (req, res) => {
  try {
    // Questa action è già protetta da adminOnly nella route
    const clienti = await getAllClienti();
    return sendSuccess(res, clienti);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get clienti", 500);
  }
};

const getSingleCliente = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Se non è admin, può vedere solo il proprio profilo
    if (req.user.role !== 'admin' && Number(req.user.id) !== id) {
      return sendError(res, 'Forbidden', 403);
    }

    const cliente = await getClienteById(id);

    if (!cliente) {
      return sendError(res, `cliente with id ${id} not found`, 404);
    }

    return sendSuccess(res, cliente);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get cliente", 500);
  }
};

const addCliente = async (req, res) => {
  try {
    const { nome, cognome, email, password, indirizzo, role } = req.body;

    if (!nome || !cognome || !email || !password) {
      return sendError(res, 'nome, cognome, email e password sono obbligatori', 400);
    }

    const createdCliente = await createCliente({
      nome,
      cognome,
      email,
      password,
      indirizzo,
      role,
    });

    return sendSuccess(res, createdCliente, 201);
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 'Email già esistente', 409);
    }

    return sendError(res, "server error: couldn't create cliente", 500);
  }
};

const removeCliente = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteClienteById(id);

    if (!deleted) {
      return sendError(res, 'Cliente non trovato', 404);
    }

    return sendSuccess(res, { success: true });
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't remove cliente", 500);
  }
};

module.exports = {
  getClienti,
  getSingleCliente,
  addCliente,
  removeCliente,
};
