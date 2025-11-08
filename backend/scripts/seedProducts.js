const { query, pool } = require('../config/database');

async function ensureCategory(nombre, descripcion) {
  const existing = await query(
    'SELECT categoria_id FROM categorias WHERE categoria = $1',
    [nombre]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].categoria_id;
  }

  const inserted = await query(
    'INSERT INTO categorias (categoria, descripcion) VALUES ($1, $2) RETURNING categoria_id',
    [nombre, descripcion]
  );

  return inserted.rows[0].categoria_id;
}

async function ensureProveedor({ razon_social, telefono, direccion, email }) {
  const existing = await query(
    'SELECT proveedor_id FROM proveedores WHERE LOWER(razon_social) = LOWER($1) LIMIT 1',
    [razon_social]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].proveedor_id;
  }

  const inserted = await query(
    `INSERT INTO proveedores (razon_social, telefono, direccion, email)
     VALUES ($1, $2, $3, $4)
     RETURNING proveedor_id`,
    [razon_social, telefono || null, direccion || null, email || null]
  );

  return inserted.rows[0].proveedor_id;
}

async function upsertProducto(producto) {
  const {
    nombre,
    codigo,
    marca,
    categoria_id,
    precio,
    stock,
    proveedor_id,
  } = producto;

  await query(
    `INSERT INTO productos (nombre, codigo, marca, categoria_id, precio, stock, proveedor_id, usuario_id, activo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, true)
     ON CONFLICT (codigo)
     DO UPDATE SET
       nombre = EXCLUDED.nombre,
       marca = EXCLUDED.marca,
       categoria_id = EXCLUDED.categoria_id,
       precio = EXCLUDED.precio,
       stock = EXCLUDED.stock,
       proveedor_id = EXCLUDED.proveedor_id,
       updated_at = CURRENT_TIMESTAMP`,
    [
      nombre,
      codigo,
      marca,
      categoria_id,
      precio,
      stock,
      proveedor_id || null,
    ]
  );
}

async function seed() {
  try {
    console.log('🌱 Iniciando carga de datos de ejemplo para productos...');

    const categoriasBase = [
      { nombre: 'Medicamentos', descripcion: 'Medicamentos de venta libre y bajo receta.' },
      { nombre: 'Suplementos', descripcion: 'Vitaminas y suplementos dietarios.' },
      { nombre: 'Cuidado Personal', descripcion: 'Productos de higiene y cuidado personal.' },
    ];

    const categoriaMap = {};
    for (const categoria of categoriasBase) {
      const id = await ensureCategory(categoria.nombre, categoria.descripcion);
      categoriaMap[categoria.nombre] = id;
    }

    const proveedoresBase = [
      {
        razon_social: 'Laboratorios Salud SA',
        telefono: '011-4555-1234',
        direccion: 'Av. Siempre Viva 123, CABA',
        email: 'contacto@labsalud.com',
      },
      {
        razon_social: 'Distribuidora Vital',
        telefono: '011-4321-5678',
        direccion: 'Belgrano 456, CABA',
        email: 'ventas@vital.com',
      },
      {
        razon_social: 'Cosmética Natural SRL',
        telefono: '011-4000-9988',
        direccion: 'San Martín 789, Buenos Aires',
        email: 'info@cosmeticanatural.com',
      },
    ];

    const proveedorMap = {};
    for (const proveedor of proveedoresBase) {
      const id = await ensureProveedor(proveedor);
      proveedorMap[proveedor.razon_social] = id;
    }

    const productos = [
      {
        nombre: 'Paracetamol 500mg 20 comp.',
        codigo: 'PARA-500-20',
        marca: 'Genfar',
        categoria: 'Medicamentos',
        precio: 1899.9,
        stock: 120,
        proveedor: 'Laboratorios Salud SA',
      },
      {
        nombre: 'Ibuprofeno 400mg 16 comp.',
        codigo: 'IBU-400-16',
        marca: 'Bagó',
        categoria: 'Medicamentos',
        precio: 2199.5,
        stock: 90,
        proveedor: 'Laboratorios Salud SA',
      },
      {
        nombre: 'Amoxicilina 500mg x21 cápsulas',
        codigo: 'AMOX-500-21',
        marca: 'Elea',
        categoria: 'Medicamentos',
        precio: 5799.0,
        stock: 75,
        proveedor: 'Laboratorios Salud SA',
      },
      {
        nombre: 'Omeprazol 20mg x30 cápsulas',
        codigo: 'OME-20-30',
        marca: 'Phoenix',
        categoria: 'Medicamentos',
        precio: 4499.99,
        stock: 65,
        proveedor: 'Laboratorios Salud SA',
      },
      {
        nombre: 'Jarabe para la tos 120ml',
        codigo: 'JAR-RESP-120',
        marca: 'Broncolin',
        categoria: 'Medicamentos',
        precio: 3599.5,
        stock: 40,
        proveedor: 'Laboratorios Salud SA',
      },
      {
        nombre: 'Multivitamínico Adultos x60',
        codigo: 'MULTI-AD-60',
        marca: 'VitalMax',
        categoria: 'Suplementos',
        precio: 4599.0,
        stock: 60,
        proveedor: 'Distribuidora Vital',
      },
      {
        nombre: 'Vitamina C 1000mg x30',
        codigo: 'VITC-1000-30',
        marca: 'NutriPlus',
        categoria: 'Suplementos',
        precio: 3299.75,
        stock: 80,
        proveedor: 'Distribuidora Vital',
      },
      {
        nombre: 'Proteína en polvo sabor vainilla 1kg',
        codigo: 'PROT-VAN-1KG',
        marca: 'PowerFit',
        categoria: 'Suplementos',
        precio: 15999.9,
        stock: 35,
        proveedor: 'Distribuidora Vital',
      },
      {
        nombre: 'Omega 3 1000mg x100 cápsulas blandas',
        codigo: 'OMEGA3-1000-100',
        marca: 'HealthyLife',
        categoria: 'Suplementos',
        precio: 8999.99,
        stock: 50,
        proveedor: 'Distribuidora Vital',
      },
      {
        nombre: 'Colágeno + Vitamina C x30 sobres',
        codigo: 'COLAGENO-VC-30',
        marca: 'VitalPlus',
        categoria: 'Suplementos',
        precio: 12599.5,
        stock: 45,
        proveedor: 'Distribuidora Vital',
      },
      {
        nombre: 'Crema Hidratante Facial 50ml',
        codigo: 'CREMA-HID-50',
        marca: 'DermaCare',
        categoria: 'Cuidado Personal',
        precio: 5999.99,
        stock: 45,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Protector Solar FPS50 200ml',
        codigo: 'SOLAR-FPS50-200',
        marca: 'SunShield',
        categoria: 'Cuidado Personal',
        precio: 7999.5,
        stock: 55,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Shampoo Anticaspa 400ml',
        codigo: 'SHAMP-ANT-400',
        marca: 'HairFree',
        categoria: 'Cuidado Personal',
        precio: 3499.99,
        stock: 70,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Acondicionador Nutritivo 400ml',
        codigo: 'ACOND-NUT-400',
        marca: 'HairFree',
        categoria: 'Cuidado Personal',
        precio: 3599.99,
        stock: 65,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Kit de maquillaje natural',
        codigo: 'KIT-MAKEUP-NAT',
        marca: 'GlowBeauty',
        categoria: 'Cuidado Personal',
        precio: 10999.0,
        stock: 30,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Gel antibacterial 500ml',
        codigo: 'GEL-ANT-500',
        marca: 'SafeHands',
        categoria: 'Cuidado Personal',
        precio: 2999.5,
        stock: 100,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Termómetro digital de contacto',
        codigo: 'TERM-DIG-1',
        marca: 'HealthTech',
        categoria: 'Cuidado Personal',
        precio: 6499.9,
        stock: 25,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Tensiometro Digital de Muñeca',
        codigo: 'TENS-MUN-1',
        marca: 'HealthTech',
        categoria: 'Cuidado Personal',
        precio: 22999.9,
        stock: 20,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Mascarilla facial detox x5 unidades',
        codigo: 'MASK-DETOX-5',
        marca: 'GlowBeauty',
        categoria: 'Cuidado Personal',
        precio: 4499.99,
        stock: 60,
        proveedor: 'Cosmética Natural SRL',
      },
      {
        nombre: 'Spray nasal descongestivo 20ml',
        codigo: 'SPRAY-NAS-20',
        marca: 'RespiraBien',
        categoria: 'Medicamentos',
        precio: 4599.5,
        stock: 35,
        proveedor: 'Laboratorios Salud SA',
      },
      {
        nombre: 'Analgésico tópico pomada 30g',
        codigo: 'POM-ANALG-30',
        marca: 'AlivioPlus',
        categoria: 'Medicamentos',
        precio: 2899.0,
        stock: 50,
        proveedor: 'Laboratorios Salud SA',
      },
    ];

    for (const producto of productos) {
      await upsertProducto({
        nombre: producto.nombre,
        codigo: producto.codigo,
        marca: producto.marca,
        categoria_id: categoriaMap[producto.categoria],
        precio: producto.precio,
        stock: producto.stock,
        proveedor_id: proveedorMap[producto.proveedor],
      });
    }

    console.log('✅ Productos de ejemplo cargados correctamente.');
  } catch (error) {
    console.error('❌ Error sembrando productos:', error);
  } finally {
    await pool.end();
  }
}

seed();

