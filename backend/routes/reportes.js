// Rutas de reportes
const express = require('express');
const router = express.Router();
const { getReportes } = require('../controllers/otrosController');

router.get('/', getReportes);

module.exports = router;

