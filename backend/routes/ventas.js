// Rutas de ventas
const express = require('express');
const router = express.Router();
const {
  getVentas,
  getUltimaVenta,
  getVentasByCliente,
  getVentaDetalle,
  createVenta
} = require('../controllers/otrosController');

router.get('/ultima-venta', getUltimaVenta);
router.get('/cliente/:clienteId', getVentasByCliente);
router.get('/venta-id/:ventaId', getVentaDetalle);
router.get('/', getVentas);
router.post('/', createVenta);

module.exports = router;

