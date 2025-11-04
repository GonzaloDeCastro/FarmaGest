// Rutas de obras sociales
const express = require('express');
const router = express.Router();
const {
  getObrasSociales,
  createObraSocial,
  updateObraSocial,
  deleteObraSocial
} = require('../controllers/otrosController');

router.get('/', getObrasSociales);
router.post('/', createObraSocial);
router.put('/:obra_social_id', updateObraSocial);
router.delete('/:obra_social_id', deleteObraSocial);

module.exports = router;

