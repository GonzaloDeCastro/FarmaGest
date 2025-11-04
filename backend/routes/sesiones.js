// Rutas de sesiones
const express = require('express');
const router = express.Router();
const { getSesiones } = require('../controllers/otrosController');

router.get('/', getSesiones);

module.exports = router;

