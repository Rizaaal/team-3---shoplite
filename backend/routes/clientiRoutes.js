const express = require('express');
const {
  getClienti,
  getSingleCliente,
  addCliente,
  removeCliente,
} = require('../controllers/clientiController');
const { protectedRoute } = require('../middlewares/protectedRoute');
const { adminOnly } = require('../middlewares/adminOnly');

const router = express.Router();

// Registrazione cliente
router.post('/', addCliente);

// Solo admin può vedere tutti i clienti
router.get('/', protectedRoute, adminOnly, getClienti);

// Admin può vedere chiunque, il cliente può vedere solo se stesso
router.get('/:id', protectedRoute, getSingleCliente);

// Solo admin può cancellare un cliente
router.delete('/:id', protectedRoute, adminOnly, removeCliente);

module.exports = router;
