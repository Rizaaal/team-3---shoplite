const express = require('express');
const {
  getProdotti,
  getSingleProdotto,
  getProdottiByCategoriaController,
  addProdotto,
  removeProdotto,
} = require('../controllers/prodottiController');
const { protectedRoute } = require('../middlewares/protectedRoute');
const { adminOnly } = require('../middlewares/adminOnly');

const router = express.Router();

// Lettura prodotti pubblica
router.get('/', getProdotti);
router.get('/categoria/:categoria', getProdottiByCategoriaController);
router.get('/:id', getSingleProdotto);

// Solo admin può creare o cancellare prodotti
router.post('/', protectedRoute, adminOnly, addProdotto);
router.delete('/:id', protectedRoute, adminOnly, removeProdotto);

module.exports = router;
