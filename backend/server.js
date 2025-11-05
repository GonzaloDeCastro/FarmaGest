// Servidor principal de Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Importar configuración de base de datos
const { query } = require('./config/database');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const obrasSocialesRoutes = require('./routes/obrasSociales');
const proveedoresRoutes = require('./routes/proveedores');
const ventasRoutes = require('./routes/ventas');
const sesionesRoutes = require('./routes/sesiones');
const reportesRoutes = require('./routes/reportes');
const auditoriaRoutes = require('./routes/auditoria');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:3000', 'https://farma-gest.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de FarmaGest funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      clientes: '/api/clientes',
      obrasSociales: '/api/obras-sociales',
      proveedores: '/api/proveedores',
      ventas: '/api/ventas',
      sesiones: '/api/sesiones',
      reportes: '/api/reportes',
      auditoria: '/api/auditoria'
    }
  });
});

// Ruta de salud (health check)
app.get('/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rutas API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/obras-sociales', obrasSocialesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/auditoria', auditoriaRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base de datos: ${process.env.DB_NAME || 'farmagest'}`);
});

module.exports = app;

