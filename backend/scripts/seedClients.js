const { query, pool } = require('../config/database');

async function ensureCity(nombre) {
  const existing = await query(
    'SELECT ciudad_id FROM ciudades WHERE LOWER(ciudad) = LOWER($1) LIMIT 1',
    [nombre]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].ciudad_id;
  }

  const inserted = await query(
    'INSERT INTO ciudades (ciudad) VALUES ($1) RETURNING ciudad_id',
    [nombre]
  );

  return inserted.rows[0].ciudad_id;
}

async function ensureObraSocial(nombre, descuento) {
  const existing = await query(
    'SELECT obra_social_id FROM obras_sociales WHERE LOWER(obra_social) = LOWER($1) LIMIT 1',
    [nombre]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].obra_social_id;
  }

  const inserted = await query(
    'INSERT INTO obras_sociales (obra_social, descuento) VALUES ($1, $2) RETURNING obra_social_id',
    [nombre, descuento]
  );

  return inserted.rows[0].obra_social_id;
}

async function upsertCliente(cliente) {
  const {
    nombre,
    apellido,
    dni,
    ciudad_id,
    obra_social_id,
  } = cliente;

  await query(
    `INSERT INTO clientes (nombre, apellido, dni, ciudad_id, obra_social_id, activo)
     VALUES ($1, $2, $3, $4, $5, true)
     ON CONFLICT (dni)
     DO UPDATE SET
       nombre = EXCLUDED.nombre,
       apellido = EXCLUDED.apellido,
       ciudad_id = EXCLUDED.ciudad_id,
       obra_social_id = EXCLUDED.obra_social_id,
       updated_at = CURRENT_TIMESTAMP`,
    [
      nombre,
      apellido,
      dni,
      ciudad_id || null,
      obra_social_id || null,
    ]
  );
}

async function seed() {
  try {
    console.log('🌱 Iniciando carga de clientes de ejemplo...');

    const ciudades = [
      'Buenos Aires',
      'Córdoba',
      'Rosario',
      'La Plata',
      'Mar del Plata',
      'Mendoza',
      'San Miguel de Tucumán',
      'Salta',
      'Neuquén',
    ];

    const obrasSociales = [
      { nombre: 'OSDE', descuento: 0.15 },
      { nombre: 'Swiss Medical', descuento: 0.18 },
      { nombre: 'Galeno', descuento: 0.12 },
      { nombre: 'IOMA', descuento: 0.10 },
      { nombre: 'OSPEDYC', descuento: 0.20 },
      { nombre: 'Medicus', descuento: 0.16 },
      { nombre: 'Federada Salud', descuento: 0.14 },
      { nombre: 'Accord Salud', descuento: 0.13 },
      { nombre: 'Sancor Salud', descuento: 0.17 },
      { nombre: 'Cobertura Médica Integral', descuento: 0.11 },
      { nombre: 'Omint', descuento: 0.15 },
      { nombre: 'Prevención Salud', descuento: 0.16 },
      { nombre: 'Medifé', descuento: 0.14 },
      { nombre: 'OSDEPYM', descuento: 0.19 },
      { nombre: 'Aca Salud', descuento: 0.12 },
    ];

    const ciudadMap = {};
    for (const ciudad of ciudades) {
      ciudadMap[ciudad] = await ensureCity(ciudad);
    }

    const obraSocialMap = {};
    for (const obra of obrasSociales) {
      obraSocialMap[obra.nombre] = await ensureObraSocial(
        obra.nombre,
        obra.descuento
      );
    }

    const clientes = [
      {
        nombre: 'Ana',
        apellido: 'Gómez',
        dni: '30123456',
        ciudad: 'Buenos Aires',
        obra_social: 'OSDE',
      },
      {
        nombre: 'Carlos',
        apellido: 'Ramírez',
        dni: '29123457',
        ciudad: 'Buenos Aires',
        obra_social: 'Swiss Medical',
      },
      {
        nombre: 'Mariana',
        apellido: 'Pérez',
        dni: '30543210',
        ciudad: 'Córdoba',
        obra_social: 'Galeno',
      },
      {
        nombre: 'Jorge',
        apellido: 'López',
        dni: '31234567',
        ciudad: 'Rosario',
        obra_social: 'IOMA',
      },
      {
        nombre: 'Sofía',
        apellido: 'Martínez',
        dni: '29876543',
        ciudad: 'La Plata',
        obra_social: 'OSDE',
      },
      {
        nombre: 'Luis',
        apellido: 'Fernández',
        dni: '32765432',
        ciudad: 'Mar del Plata',
        obra_social: 'OSPEDYC',
      },
      {
        nombre: 'Paula',
        apellido: 'Sánchez',
        dni: '30456789',
        ciudad: 'Mendoza',
        obra_social: 'Swiss Medical',
      },
      {
        nombre: 'Federico',
        apellido: 'Rivas',
        dni: '31567890',
        ciudad: 'San Miguel de Tucumán',
        obra_social: 'Medicus',
      },
      {
        nombre: 'Camila',
        apellido: 'Bravo',
        dni: '31678905',
        ciudad: 'Salta',
        obra_social: 'Galeno',
      },
      {
        nombre: 'Diego',
        apellido: 'Benítez',
        dni: '29567890',
        ciudad: 'Neuquén',
        obra_social: 'IOMA',
      },
      {
        nombre: 'Laura',
        apellido: 'Vega',
        dni: '28456781',
        ciudad: 'Buenos Aires',
        obra_social: 'OSDE',
      },
      {
        nombre: 'Martín',
        apellido: 'Suárez',
        dni: '31876543',
        ciudad: 'Buenos Aires',
        obra_social: 'OSPEDYC',
      },
      {
        nombre: 'Valentina',
        apellido: 'Gutiérrez',
        dni: '32098765',
        ciudad: 'Córdoba',
        obra_social: 'Medicus',
      },
      {
        nombre: 'Nicolás',
        apellido: 'Acosta',
        dni: '29987654',
        ciudad: 'Rosario',
        obra_social: 'Swiss Medical',
      },
      {
        nombre: 'Julieta',
        apellido: 'Mansilla',
        dni: '30345678',
        ciudad: 'Mar del Plata',
        obra_social: 'OSDE',
      },
    ];

    for (const cliente of clientes) {
      await upsertCliente({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        dni: cliente.dni,
        correo: cliente.correo,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        ciudad_id: ciudadMap[cliente.ciudad],
        obra_social_id: obraSocialMap[cliente.obra_social],
      });
    }

    console.log('✅ Clientes de ejemplo cargados correctamente.');
  } catch (error) {
    console.error('❌ Error sembrando clientes:', error);
  } finally {
    await pool.end();
  }
}

seed();

