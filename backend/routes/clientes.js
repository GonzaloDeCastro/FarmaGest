// Rutas de clientes
const express = require('express');
const router = express.Router();
const {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} = require('../controllers/otrosController');

router.get('/', getClientes);
router.post('/', createCliente);
router.put('/:cliente_id', updateCliente);
router.delete('/:cliente_id', deleteCliente);

module.exports = router;

