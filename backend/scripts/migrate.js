// Script para migrar la base de datos en Railway
// Este script se puede ejecutar desde Railway CLI o localmente con las credenciales de Railway

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Las credenciales vendrán de las variables de entorno de Railway
const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST,
  port: process.env.DB_PORT || process.env.PGPORT,
  database: process.env.DB_NAME || process.env.PGDATABASE,
  user: process.env.DB_USER || process.env.PGUSER,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateDatabase() {
  try {
    console.log('🔄 Iniciando migración de base de datos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'crear-todo-farmagest.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir por comandos (separados por punto y coma)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.includes('\\c') || command.includes('\\gexec')) {
        // Ignorar comandos de psql
        continue;
      }
      
      try {
        await pool.query(command);
        console.log(`✅ Comando ${i + 1}/${commands.length} ejecutado`);
      } catch (error) {
        // Ignorar errores de "ya existe" pero mostrar otros
        if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
          console.warn(`⚠️  Error en comando ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('✅ Migración completada');
    
    // Ejecutar script de usuarios iniciales
    console.log('🔐 Configurando usuarios iniciales...');
    const setupUsers = require('./scripts/setupUsers');
    await setupUsers();
    
    console.log('🎉 Base de datos lista!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migrateDatabase();

