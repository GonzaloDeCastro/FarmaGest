// Rutas de ventas
const express = require('express');
const router = express.Router();
const {
  getVentas,
  createVenta
} = require('../controllers/otrosController');

router.get('/', getVentas);
router.post('/', createVenta);

module.exports = router;

