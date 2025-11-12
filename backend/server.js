// Servidor principal de Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

console.log('📦 Cargando módulos...');

// Importar configuración de base de datos
const { query } = require('./config/database');

console.log('📦 Cargando rutas...');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const obrasSocialesRoutes = require('./routes/obrasSociales');
const proveedoresRoutes = require('./routes/proveedores');
const ventasRoutes = require('./routes/ventas');
const sesionesRoutes = require('./routes/sesiones');
const reportesRoutes = require('./routes/reportes');
const auditoriaRoutes = require('./routes/auditoria');
const {
  getUltimaVenta,
  getVentasByCliente,
  getVentaDetalle,
  getAuditoriaProductosList,
  getAuditoriaClientesList,
  getAuditoriaObrasSocialesList,
  getAuditoriaObrasSocialesLiquidacion,
  sendAuditoriaObrasSocialesLiquidacionEmail,
} = require('./controllers/otrosController');

console.log('✅ Todos los módulos cargados correctamente');

const app = express();

// Verificar que el puerto esté configurado
if (!process.env.PORT && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  PORT no está configurado en producción');
}

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

// Ruta de salud (health check) - conexión lazy a la base de datos
app.get('/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Error en health check:', error);
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rutas API
app.get('/api/ventas/ultima-venta', getUltimaVenta);
app.get('/api/ventas/cliente/:clienteId', getVentasByCliente);
app.get('/api/ventas/venta-id/:ventaId', getVentaDetalle);
app.get('/api/auditoria-productos', getAuditoriaProductosList);
app.get('/api/auditoria-clientes', getAuditoriaClientesList);
app.get('/api/auditoria-obras-sociales', getAuditoriaObrasSocialesList);
app.get('/api/auditoria-obras-sociales/liquidacion', getAuditoriaObrasSocialesLiquidacion);
app.post('/api/auditoria-obras-sociales/liquidacion/email', sendAuditoriaObrasSocialesLiquidacionEmail);
app.use('/api/ventas', ventasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/obras-sociales', obrasSocialesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
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

// Iniciar servidor - DEBE ser lo primero para que Render detecte el puerto
const PORT = process.env.PORT || 5000;

console.log(`🔍 Iniciando servidor en puerto ${PORT}...`);
console.log(`🔍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔍 DATABASE_URL configurada: ${process.env.DATABASE_URL ? 'Sí' : 'No'}`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base de datos: ${process.env.DB_NAME || 'farmagest'}`);
  console.log(`✅ Servidor listo para recibir conexiones`);
  console.log(`✅ Puerto ${PORT} abierto y escuchando`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Puerto ${PORT} ya está en uso`);
  } else {
    console.error('❌ Error del servidor:', error);
  }
  process.exit(1);
});

// Verificar que el servidor esté escuchando
server.on('listening', () => {
  const addr = server.address();
  console.log(`✅ Servidor escuchando en ${addr.address}:${addr.port}`);
});

module.exports = app;

