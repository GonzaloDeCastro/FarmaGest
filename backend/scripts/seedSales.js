const { query, pool } = require('../config/database');

async function getBaseData() {
  const clientesRes = await query(
    'SELECT cliente_id FROM clientes ORDER BY cliente_id LIMIT 20'
  );
  const productosRes = await query(
    'SELECT producto_id, codigo, nombre, precio, stock FROM productos ORDER BY producto_id'
  );
  const usuariosRes = await query(
    'SELECT usuario_id FROM usuarios ORDER BY usuario_id LIMIT 1'
  );

  if (clientesRes.rows.length === 0) {
    throw new Error('No hay clientes disponibles para generar ventas.');
  }

  if (productosRes.rows.length < 3) {
    throw new Error('Se requieren al menos 3 productos para generar ventas.');
  }

  if (usuariosRes.rows.length === 0) {
    throw new Error('No hay usuarios disponibles para asociar a la venta.');
  }

  return {
    clientes: clientesRes.rows.map((row) => row.cliente_id),
    productos: productosRes.rows.map((row) => ({
      producto_id: row.producto_id,
      codigo: row.codigo,
      nombre: row.nombre,
      precio: Number(row.precio),
      stock: Number(row.stock),
    })),
    usuarioId: usuariosRes.rows[0].usuario_id,
  };
}

function buildProductMap(productos) {
  const map = new Map();
  for (const producto of productos) {
    map.set(producto.codigo, producto);
  }
  return map;
}

function calcularTotales(items) {
  const subtotal = items.reduce(
    (acum, item) => acum + item.precio_unitario * item.cantidad,
    0
  );
  return subtotal;
}

async function seed() {
  try {
    console.log('🌱 Iniciando carga de ventas de ejemplo...');

    const { clientes, productos, usuarioId } = await getBaseData();
    const productoMap = buildProductMap(productos);

    const ventas = [
      {
        clienteIndex: 0,
        fecha: '2025-01-10T10:30:00Z',
        descuento: 0.1,
        forma_pago: 'Tarjeta',
        items: [
          { codigo: 'PARA-500-20', cantidad: 2 },
          { codigo: 'IBU-400-16', cantidad: 1 },
        ],
      },
      {
        clienteIndex: 1,
        fecha: '2025-01-12T15:45:00Z',
        descuento: 0,
        forma_pago: 'Efectivo',
        items: [
          { codigo: 'CREMA-HID-50', cantidad: 1 },
          { codigo: 'SOLAR-FPS50-200', cantidad: 1 },
        ],
      },
      {
        clienteIndex: 2,
        fecha: '2025-01-18T09:15:00Z',
        descuento: 0.05,
        forma_pago: 'Transferencia',
        items: [
          { codigo: 'MULTI-AD-60', cantidad: 1 },
          { codigo: 'VITC-1000-30', cantidad: 2 },
        ],
      },
      {
        clienteIndex: 3,
        fecha: '2025-01-20T18:05:00Z',
        descuento: 0.15,
        forma_pago: 'Tarjeta',
        items: [
          { codigo: 'OME-20-30', cantidad: 1 },
          { codigo: 'JAR-RESP-120', cantidad: 1 },
          { codigo: 'SUERO-FIS-500', cantidad: 2 },
        ],
      },
      {
        clienteIndex: 4,
        fecha: '2025-01-25T11:55:00Z',
        descuento: 0.08,
        forma_pago: 'Débito',
        items: [
          { codigo: 'PROT-VAN-1KG', cantidad: 1 },
          { codigo: 'OMEGA3-1000-100', cantidad: 1 },
        ],
      },
    ];

    let facturaCorrelativo = 100;

    for (const venta of ventas) {
      const cliente_id = clientes[venta.clienteIndex % clientes.length];
      const numeroFactura = `F-${String(facturaCorrelativo).padStart(6, '0')}`;
      facturaCorrelativo += 1;

      const preparedItems = venta.items.map((item) => {
        const producto = productoMap.get(item.codigo);
        if (!producto) {
          throw new Error(`No se encontró el producto con código ${item.codigo}`);
        }
        if (producto.stock < item.cantidad) {
          console.warn(
            `⚠️ Stock insuficiente para ${producto.nombre} (requiere ${item.cantidad}, disponible ${producto.stock}). Se omitirá esta venta.`
          );
        }
        return {
          producto_id: producto.producto_id,
          codigo: producto.codigo,
          cantidad: item.cantidad,
          precio_unitario: Number(producto.precio),
        };
      });

      // verificar stocks suficientes
      if (
        preparedItems.some(
          (item) =>
            productoMap.get(item.codigo)?.stock < item.cantidad ||
            productoMap.get(item.codigo) == null
        )
      ) {
        console.warn('⚠️ Venta omitida por stock insuficiente.');
        continue;
      }

      const subtotal = calcularTotales(preparedItems);
      const descuento = venta.descuento || 0;
      const total = subtotal * (1 - descuento);

      try {
        await query('BEGIN');

        const ventaResult = await query(
          `INSERT INTO ventas (cliente_id, usuario_id, numero_factura, fecha, subtotal, descuento, total, forma_pago)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING venta_id`,
          [
            cliente_id,
            usuarioId,
            numeroFactura,
            new Date(venta.fecha),
            subtotal,
            descuento,
            total,
            venta.forma_pago || null,
          ]
        );

        const venta_id = ventaResult.rows[0].venta_id;

        for (const item of preparedItems) {
          await query(
            `INSERT INTO ventas_items (venta_id, producto_id, cantidad, precio_unitario, subtotal)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              venta_id,
              item.producto_id,
              item.cantidad,
              item.precio_unitario,
              item.precio_unitario * item.cantidad,
            ]
          );

          await query(
            'UPDATE productos SET stock = stock - $1 WHERE producto_id = $2',
            [item.cantidad, item.producto_id]
          );

          const productoRef = productoMap.get(item.codigo);
          if (productoRef) {
            productoRef.stock -= item.cantidad;
          }
        }

        await query('COMMIT');
        console.log(`✅ Venta ${numeroFactura} creada (ID ${venta_id})`);
      } catch (error) {
        await query('ROLLBACK');
        console.error('❌ Error al crear venta de ejemplo:', error.message);
      }
    }

    console.log('✅ Ventas de ejemplo cargadas correctamente.');
  } catch (error) {
    console.error('❌ Error general al sembrar ventas:', error.message);
  } finally {
    await pool.end();
  }
}

seed();
