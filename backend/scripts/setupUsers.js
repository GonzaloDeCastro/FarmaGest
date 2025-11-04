// Script para actualizar contraseña del admin y crear usuario de prueba
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { query } = require('../config/database');

async function setupAdmin() {
  try {
    console.log('🔐 Configurando usuarios...\n');
    
    // 1. Actualizar contraseña del admin
    const adminPassword = 'admin123';
    const adminHash = await bcrypt.hash(adminPassword, 10);
    
    console.log('Actualizando contraseña del administrador...');
    await query(
      'UPDATE usuarios SET contrasena = $1 WHERE correo = $2',
      [adminHash, 'admin@farmagest.com']
    );
    console.log('✅ Contraseña del admin actualizada: admin123\n');
    
    // 2. Verificar si ya existe un usuario de prueba
    const usuarioExistente = await query(
      'SELECT usuario_id FROM usuarios WHERE correo = $1',
      ['test@farmagest.com']
    );
    
    if (usuarioExistente.rows.length === 0) {
      // Obtener rol de Vendedor
      const rolResult = await query("SELECT rol_id FROM roles WHERE rol = 'Vendedor' LIMIT 1");
      const rolId = rolResult.rows[0].rol_id;
      
      // Crear usuario de prueba
      const testPassword = 'test123';
      const testHash = await bcrypt.hash(testPassword, 10);
      
      console.log('Creando usuario de prueba...');
      await query(
        `INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id, activo)
         VALUES ($1, $2, $3, $4, $5, true)`,
        ['Usuario', 'Prueba', 'test@farmagest.com', testHash, rolId]
      );
      console.log('✅ Usuario de prueba creado: test@farmagest.com / test123\n');
    } else {
      console.log('ℹ️  Usuario de prueba ya existe\n');
    }
    
    // Mostrar usuarios disponibles
    console.log('📋 Usuarios disponibles:\n');
    const usuarios = await query(
      `SELECT u.correo, u.nombre, u.apellido, r.rol 
       FROM usuarios u 
       LEFT JOIN roles r ON u.rol_id = r.rol_id 
       WHERE u.activo = true 
       ORDER BY u.usuario_id`
    );
    
    usuarios.rows.forEach(usuario => {
      console.log(`  - ${usuario.correo} (${usuario.nombre} ${usuario.apellido}) - ${usuario.rol}`);
    });
    
    console.log('\n✅ Configuración completada!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();

