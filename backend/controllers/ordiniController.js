const { createOrdine, getOrdineCompletoById } = require('../services/ordiniService');
const {
  createPaymentIntentForOrdine,
  confirmPagamentoOrdine,
} = require('../services/pagamentiService');
const { sendSuccess, sendError } = require('../utils/response');

const addOrdine = async (req, res) => {
  try {
    const { prodotti, indirizzoSpedizione, postalCode, city } = req.body;

    // L'id cliente arriva dal token JWT
    const idCliente = req.user.id;

    if (!indirizzoSpedizione || !postalCode || !city) {
      return sendError(res, 'indirizzoSpedizione, postalCode e city sono obbligatori', 400);
    }

    const ordine = await createOrdine({
      idCliente,
      prodotti,
      indirizzoSpedizione,
      postalCode,
      city,
    });

    return sendSuccess(res, ordine, 201);
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      error.message || "server error: couldn't create ordine",
      error.statusCode || 500,
    );
  }
};

const getSingleOrdine = async (req, res) => {
  try {
    const idOrdine = Number(req.params.id);
    const ordine = await getOrdineCompletoById(idOrdine);

    if (!ordine) {
      return sendError(res, 'Ordine non trovato', 404);
    }

    // Solo admin può vedere qualsiasi ordine
    // Il cliente può vedere solo i propri ordini
    if (req.user.role !== 'admin' && Number(req.user.id) !== Number(ordine.idCliente)) {
      return sendError(res, 'Forbidden', 403);
    }

    return sendSuccess(res, ordine);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get ordine", 500);
  }
};

const createOrdinePaymentIntent = async (req, res, next) => {
  try {
    const idOrdine = Number(req.params.id);
    const { metodo } = req.body;

    const ordine = await getOrdineCompletoById(idOrdine);

    if (!ordine) {
      return sendError(res, 'Ordine non trovato', 404);
    }

    // Solo admin o proprietario ordine
    if (req.user.role !== 'admin' && Number(req.user.id) !== Number(ordine.idCliente)) {
      return sendError(res, 'Forbidden', 403);
    }

    const result = await createPaymentIntentForOrdine({
      idOrdine,
      metodo,
    });

    return sendSuccess(res, result, 201);
  } catch (error) {
    return next(error);
  }
};

const confirmOrdinePagamento = async (req, res, next) => {
  try {
    const idOrdine = Number(req.params.id);
    const { paymentIntentId, metodo } = req.body;

    const ordine = await getOrdineCompletoById(idOrdine);

    if (!ordine) {
      return sendError(res, 'Ordine non trovato', 404);
    }

    // Solo admin o proprietario ordine
    if (req.user.role !== 'admin' && Number(req.user.id) !== Number(ordine.idCliente)) {
      return sendError(res, 'Forbidden', 403);
    }

    const result = await confirmPagamentoOrdine({
      idOrdine,
      paymentIntentId,
      metodo,
    });

    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addOrdine,
  getSingleOrdine,
  createOrdinePaymentIntent,
  confirmOrdinePagamento,
};
