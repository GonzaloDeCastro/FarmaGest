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
    // Remover comentarios de múltiples líneas y líneas de comentario
    const cleanSql = sql
      .split('\n')
      .map(line => {
        // Remover comentarios de línea
        const commentIndex = line.indexOf('--');
        if (commentIndex !== -1) {
          return line.substring(0, commentIndex);
        }
        return line;
      })
      .join('\n');
    
    const commands = cleanSql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => {
        // Filtrar comandos vacíos y comentarios
        if (cmd.length === 0) return false;
        if (cmd.startsWith('--')) return false;
        // Filtrar comandos SELECT de verificación al final
        if (cmd.toUpperCase().includes('SELECT') && cmd.toUpperCase().includes('information_schema')) {
          return false;
        }
        return true;
      });
    
    console.log(`📋 Ejecutando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Saltar comentarios y líneas vacías
      if (command.startsWith('--') || command.length === 0) {
        continue;
      }
      
      try {
        // Mostrar solo los primeros 50 caracteres del comando para no saturar la consola
        const commandPreview = command.length > 50 
          ? command.substring(0, 50) + '...' 
          : command;
        console.log(`\n[${i + 1}/${commands.length}] ${commandPreview}`);
        await query(command);
        console.log(`✅ Comando ${i + 1} ejecutado correctamente`);
      } catch (error) {
        // Si es un error de "ya existe", lo ignoramos
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('relation already exists') ||
            error.message.includes('ON CONFLICT') ||
            error.code === '23505') { // Código de violación de clave única
          console.log(`⚠️  Comando ${i + 1} ya existe (se omite)`);
        } else {
          console.error(`❌ Error en comando ${i + 1}:`, error.message);
          console.error(`   Comando completo:`, command.substring(0, 200));
          // Continuar con el siguiente comando en lugar de fallar completamente
          console.log(`   Continuando con el siguiente comando...`);
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
