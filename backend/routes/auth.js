const express = require('express');
const router = express.Router();
const {
  requestPasswordReset,
  resetPasswordWithToken,
  loginUsuario,
} = require('../controllers/usuariosController');

router.get('/login', loginUsuario);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPasswordWithToken);

module.exports = router;

