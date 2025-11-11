// Rutas de usuarios
const express = require('express');
const router = express.Router();
const {
  getUsuarios,
  getRoles,
  loginUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  updatePassword,
  logoutUsuario,
  requestPasswordReset,
  resetPasswordWithToken,
} = require('../controllers/usuariosController');

// Rutas
router.get('/login', loginUsuario);
router.get('/roles', getRoles);
router.get('/', getUsuarios);
router.post('/', createUsuario);
router.put('/logout/:sesion_id', logoutUsuario);
router.put('/:usuario_id', updateUsuario);
router.delete('/:usuario_id', deleteUsuario);
router.put('/pwd/:correo', updatePassword);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPasswordWithToken);

module.exports = router;

