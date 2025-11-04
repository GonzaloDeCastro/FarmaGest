// Rutas de proveedores
const express = require('express');
const router = express.Router();
const {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor
} = require('../controllers/otrosController');

router.get('/', getProveedores);
router.post('/', createProveedor);
router.put('/:proveedor_id', updateProveedor);
router.delete('/:proveedor_id', deleteProveedor);

module.exports = router;

