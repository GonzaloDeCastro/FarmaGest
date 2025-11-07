// Rutas de clientes
const express = require('express');
const router = express.Router();
const {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} = require('../controllers/clientesController');
const { getObrasSociales } = require('../controllers/obrasSocialesController');
const { getCiudades } = require('../controllers/ciudadesController');

router.get('/', getClientes);
router.get('/obras-sociales', getObrasSociales);
router.get('/ciudades', getCiudades);
router.post('/', createCliente);
router.put('/:cliente_id', updateCliente);
router.delete('/:cliente_id', deleteCliente);

module.exports = router;

