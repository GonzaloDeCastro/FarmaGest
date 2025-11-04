// Rutas de productos
const express = require('express');
const router = express.Router();
const {
  getProductos,
  getCategorias,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productosController');

router.get('/categorias', getCategorias);
router.get('/', getProductos);
router.post('/', createProducto);
router.put('/:producto_id', updateProducto);
router.delete('/:producto_id', deleteProducto);

module.exports = router;

