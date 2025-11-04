// Rutas de auditoría
const express = require('express');
const router = express.Router();
const { getAuditoria } = require('../controllers/otrosController');

router.get('/', getAuditoria);

module.exports = router;

