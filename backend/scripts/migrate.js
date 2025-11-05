// Script de migración para ejecutar el esquema en Render
// Ejecutar: node backend/scripts/migrate.js

const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

async function migrate() {
  try {
    console.log('🚀 Iniciando migración de base de datos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '../../crear-esquema-farmagest.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir por ; y ejecutar cada comando
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📋 Ejecutando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Saltar comentarios y líneas vacías
      if (command.startsWith('--') || command.length === 0) {
        continue;
      }
      
      try {
        console.log(`\n[${i + 1}/${commands.length}] Ejecutando comando...`);
        await query(command);
        console.log(`✅ Comando ${i + 1} ejecutado correctamente`);
      } catch (error) {
        // Si es un error de "ya existe", lo ignoramos
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('relation already exists')) {
          console.log(`⚠️  Comando ${i + 1} ya existe (se omite)`);
        } else {
          console.error(`❌ Error en comando ${i + 1}:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('\n✅ Migración completada exitosamente!');
    
    // Verificar que las tablas se crearon
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log(`\n📊 Tablas creadas: ${tables.rows.length}`);
    tables.rows.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  migrate();
}

module.exports = migrate;
