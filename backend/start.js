#!/usr/bin/env node
// Script de inicio para Render - asegura que el servidor inicie correctamente

console.log('🚀 Iniciando servidor FarmaGest...');
console.log(`📅 Fecha: ${new Date().toISOString()}`);
console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Puerto: ${process.env.PORT || '5000 (default)'}`);

// Verificar variables de entorno críticas
if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL configurada');
} else {
  console.warn('⚠️  DATABASE_URL no está configurada');
}

if (process.env.PORT) {
  console.log(`✅ PORT configurado: ${process.env.PORT}`);
} else {
  console.warn('⚠️  PORT no está configurado - usando puerto por defecto');
}

// Cargar el servidor SIN try-catch para ver errores completos
console.log('📦 Cargando módulo del servidor...');
console.log('📂 Directorio actual:', process.cwd());
console.log('📂 Intentando cargar: ./server.js');

try {
  require('./server');
  console.log('✅ Módulo del servidor cargado correctamente');
} catch (error) {
  console.error('❌ Error al cargar el servidor:', error);
  console.error('❌ Stack:', error.stack);
  process.exit(1);
}

