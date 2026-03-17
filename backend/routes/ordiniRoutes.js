const express = require('express');
const {
  addOrdine,
  getSingleOrdine,
  createOrdinePaymentIntent,
  confirmOrdinePagamento,
} = require('../controllers/ordiniController');
const { protectedRoute } = require('../middlewares/protectedRoute');

const router = express.Router();

router.post('/', protectedRoute, addOrdine);
router.get('/:id', protectedRoute, getSingleOrdine);
router.post('/:id/pagamento-intent', protectedRoute, createOrdinePaymentIntent);
router.post('/:id/conferma-pagamento', protectedRoute, confirmOrdinePagamento);

module.exports = router;
