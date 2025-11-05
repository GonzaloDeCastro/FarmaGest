// Configuración de la base de datos PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Configurando conexión a PostgreSQL...');
console.log(`🔍 DATABASE_URL presente: ${process.env.DATABASE_URL ? 'Sí' : 'No'}`);

// Render proporciona DATABASE_URL, si no existe usa variables individuales
let poolConfig;
if (process.env.DATABASE_URL) {
  // Detecta si es una conexión externa (Render External DB URL)
  const isExternalConnection = process.env.DATABASE_URL.includes('.render.com');
  
  console.log(`🔍 Tipo de conexión: ${isExternalConnection ? 'Externa (Render)' : 'Interna'}`);
  
  // Render usa DATABASE_URL - siempre requiere SSL para conexiones externas
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isExternalConnection || process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false
  };
} else {
  console.log('🔍 Usando configuración con variables individuales');
  // Configuración local o con variables individuales
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'farmagest',
    user: process.env.DB_USER || 'farmagest_user',
    password: process.env.DB_PASSWORD || 'farmagest123',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool({
  ...poolConfig,
  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Aumentado para Render
});

// Manejo de errores de conexión - NO debe detener el servidor
pool.on('error', (err, client) => {
  console.error('⚠️  Error inesperado en el cliente PostgreSQL:', err);
  // NO hacer process.exit aquí - el servidor debe seguir funcionando
});

// Función para probar la conexión - NO bloquea el inicio del servidor
pool.on('connect', () => {
  console.log('✅ Conexión a PostgreSQL establecida');
});

// NO intentar conectar al inicio - conexión lazy
// La conexión se establecerá cuando sea necesaria

// Función para ejecutar queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query ejecutada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en query:', error);
    throw error;
  }
};

// Función para obtener un cliente del pool (para transacciones)
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout of 5 seconds, after which we'll log this client's last query
  const timeout = setTimeout(() => {
    console.error('Un cliente ha estado marcado por más de 5 segundos');
    console.error(`El último query ejecutado en este cliente fue: ${client.lastQuery}`);
  }, 5000);
  
  // Monkey patch the query method to log the query when a delay is detected
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    return release();
  };
  
  return client;
};

module.exports = {
  query,
  getClient,
  pool
};

