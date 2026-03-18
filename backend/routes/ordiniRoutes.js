const express = require('express');
const { createCheckoutOrdine, getSingleOrdine } = require('../controllers/ordiniController');
const { optionalAuth } = require('../middlewares/optionalAuth');

const router = express.Router();

router.post('/checkout', optionalAuth, createCheckoutOrdine);
router.get('/:id', optionalAuth, getSingleOrdine);

module.exports = router;
