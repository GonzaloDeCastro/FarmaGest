// Controladores básicos para otros módulos (estructura inicial)
const { query } = require('../config/database');
const { sendLiquidacionObrasSocialesEmail } = require('../services/emailService');

// === CLIENTES ===
const getClientes = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '', sesion = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE c.activo = true';
    const params = [];
    let paramCount = 0;
    
    if (search) {
      paramCount++;
      whereClause += ` AND (c.nombre ILIKE $${paramCount} OR c.apellido ILIKE $${paramCount} OR c.dni ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    const countResult = await query(`SELECT COUNT(*) as total FROM clientes c ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].total);
    
    params.push(pageSize, offset);
    
    const result = await query(
      `SELECT c.*, os.obra_social, ci.ciudad FROM clientes c
       LEFT JOIN obras_sociales os ON c.obra_social_id = os.obra_social_id
       LEFT JOIN ciudades ci ON c.ciudad_id = ci.ciudad_id
       ${whereClause}
       ORDER BY c.cliente_id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    
    res.json({ clientes: result.rows, total, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
};

const createCliente = async (req, res) => {
  try {
    const { nombre, apellido, dni, obra_social_id, ciudad_id, usuario_id } = req.body;
    
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({ mensaje: 'Nombre, apellido y DNI son requeridos' });
    }
    
    const existente = await query('SELECT cliente_id FROM clientes WHERE dni = $1', [dni]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ mensaje: 'El DNI ya está registrado' });
    }
    
    const result = await query(
      `INSERT INTO clientes (nombre, apellido, dni, obra_social_id, ciudad_id, usuario_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING cliente_id`,
      [nombre, apellido, dni, obra_social_id || null, ciudad_id || null, usuario_id || null]
    );
    
    res.status(201).json({ cliente_id: result.rows[0].cliente_id, mensaje: 'Cliente creado correctamente' });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensaje: 'Error al crear cliente', error: error.message });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;
    const { nombre, apellido, dni, obra_social_id, ciudad_id } = req.body;
    
    await query(
      `UPDATE clientes SET nombre = $1, apellido = $2, dni = $3, obra_social_id = $4, ciudad_id = $5 WHERE cliente_id = $6`,
      [nombre, apellido, dni, obra_social_id || null, ciudad_id || null, cliente_id]
    );
    
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente', error: error.message });
  }
};

const deleteCliente = async (req, res) => {
  try {
    await query('UPDATE clientes SET activo = false WHERE cliente_id = $1', [req.params.cliente_id]);
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
};

// === OBRAS SOCIALES ===
const getObrasSociales = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE activo = true';
    const params = [];
    
    if (search) {
      whereClause += ' AND obra_social ILIKE $1';
      params.push(`%${search}%`);
    }
    
    const countResult = await query(`SELECT COUNT(*) as total FROM obras_sociales ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].total);
    
    params.push(pageSize, offset);
    
    const result = await query(
      `SELECT * FROM obras_sociales ${whereClause} ORDER BY obra_social_id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    
    res.json({ obrasSociales: result.rows, total, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (error) {
    console.error('Error al obtener obras sociales:', error);
    res.status(500).json({ mensaje: 'Error al obtener obras sociales', error: error.message });
  }
};

const createObraSocial = async (req, res) => {
  try {
    const { obra_social, plan, descuento, codigo } = req.body;
    const result = await query(
      `INSERT INTO obras_sociales (obra_social, plan, descuento, codigo, activo)
       VALUES ($1, $2, $3, $4, true) RETURNING obra_social_id`,
      [obra_social, plan || null, descuento || 0, codigo || null]
    );
    res.status(201).json({ obra_social_id: result.rows[0].obra_social_id });
  } catch (error) {
    console.error('Error al crear obra social:', error);
    res.status(500).json({ mensaje: 'Error al crear obra social', error: error.message });
  }
};

const updateObraSocial = async (req, res) => {
  try {
    const { obra_social_id } = req.params;
    const { obra_social, plan, descuento, codigo } = req.body;
    await query(
      `UPDATE obras_sociales SET obra_social = $1, plan = $2, descuento = $3, codigo = $4 WHERE obra_social_id = $5`,
      [obra_social, plan, descuento, codigo, obra_social_id]
    );
    res.json({ mensaje: 'Obra social actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar obra social:', error);
    res.status(500).json({ mensaje: 'Error al actualizar obra social', error: error.message });
  }
};

const deleteObraSocial = async (req, res) => {
  try {
    await query('UPDATE obras_sociales SET activo = false WHERE obra_social_id = $1', [req.params.obra_social_id]);
    res.json({ mensaje: 'Obra social eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar obra social:', error);
    res.status(500).json({ mensaje: 'Error al eliminar obra social', error: error.message });
  }
};

// === PROVEEDORES ===
const getProveedores = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '', sesion = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE activo = true';
    const params = [];
    
    if (search) {
      whereClause += ' AND razon_social ILIKE $1';
      params.push(`%${search}%`);
    }
    
    const countResult = await query(`SELECT COUNT(*) as total FROM proveedores ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].total);
    
    params.push(pageSize, offset);
    
    const result = await query(
      `SELECT * FROM proveedores ${whereClause} ORDER BY proveedor_id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    
    res.json({ proveedores: result.rows, total, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ mensaje: 'Error al obtener proveedores', error: error.message });
  }
};

const createProveedor = async (req, res) => {
  try {
    const { razon_social, telefono, direccion, email } = req.body;
    const result = await query(
      `INSERT INTO proveedores (razon_social, telefono, direccion, email, activo)
       VALUES ($1, $2, $3, $4, true) RETURNING proveedor_id`,
      [razon_social, telefono || null, direccion || null, email || null]
    );
    res.status(201).json({ proveedor_id: result.rows[0].proveedor_id });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ mensaje: 'Error al crear proveedor', error: error.message });
  }
};

const updateProveedor = async (req, res) => {
  try {
    const { proveedor_id } = req.params;
    const { razon_social, telefono, direccion, email } = req.body;
    await query(
      `UPDATE proveedores SET razon_social = $1, telefono = $2, direccion = $3, email = $4 WHERE proveedor_id = $5`,
      [razon_social, telefono, direccion, email, proveedor_id]
    );
    res.json({ mensaje: 'Proveedor actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ mensaje: 'Error al actualizar proveedor', error: error.message });
  }
};

const deleteProveedor = async (req, res) => {
  try {
    await query('UPDATE proveedores SET activo = false WHERE proveedor_id = $1', [req.params.proveedor_id]);
    res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ mensaje: 'Error al eliminar proveedor', error: error.message });
  }
};

// === SESIONES ===
const getSesiones = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    const countResult = await query('SELECT COUNT(*) as total FROM sesiones');
    const total = parseInt(countResult.rows[0].total);
    
    const result = await query(
      `SELECT s.*, u.nombre, u.apellido, u.correo FROM sesiones s
       LEFT JOIN usuarios u ON s.usuario_id = u.usuario_id
       ORDER BY s.fecha_inicio DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );
    
    res.json({ sesiones: result.rows, total, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    res.status(500).json({ mensaje: 'Error al obtener sesiones', error: error.message });
  }
};

// === VENTAS ===
const getVentas = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      fechaDesde,
      fechaHasta,
      numeroFactura,
      clienteId,
    } = req.query;

    const pageNumber = Number(page) || 1;
    const pageSizeNumber = Number(pageSize) || 10;
    const offset = (pageNumber - 1) * pageSizeNumber;

    const filters = [];
    const params = [];

    const addCondition = (builder, value) => {
      params.push(value);
      const placeholder = `$${params.length}`;
      filters.push(builder(placeholder));
    };

    if (search) {
      addCondition(
        (placeholder) =>
          `(CAST(v.numero_factura AS TEXT) ILIKE ${placeholder} OR c.nombre ILIKE ${placeholder} OR c.apellido ILIKE ${placeholder} OR u.nombre ILIKE ${placeholder} OR u.apellido ILIKE ${placeholder})`,
        `%${search}%`
      );
    }

    if (numeroFactura) {
      addCondition(
        (placeholder) => `CAST(v.numero_factura AS TEXT) ILIKE ${placeholder}`,
        `%${numeroFactura}%`
      );
    }

    if (clienteId) {
      const clienteIdNumber = Number(clienteId);
      if (!Number.isNaN(clienteIdNumber)) {
        addCondition(
          (placeholder) => `v.cliente_id = ${placeholder}`,
          clienteIdNumber
        );
      }
    }

    const fechaReferenciaCampo = 'v.fecha';

    if (fechaDesde) {
      const fechaInicio = new Date(fechaDesde);
      if (!Number.isNaN(fechaInicio.getTime())) {
        addCondition(
          (placeholder) => `${fechaReferenciaCampo} >= ${placeholder}`,
          fechaInicio
        );
      }
    }

    if (fechaHasta) {
      const fechaFin = new Date(fechaHasta);
      if (!Number.isNaN(fechaFin.getTime())) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        addCondition(
          (placeholder) => `${fechaReferenciaCampo} < ${placeholder}`,
          fechaFin
        );
      }
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.cliente_id
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows?.[0]?.total ?? '0', 10);

    const dataQuery = `
      SELECT v.*,
             c.nombre AS cliente_nombre,
             c.apellido AS cliente_apellido,
             u.nombre AS usuario_nombre,
             u.apellido AS usuario_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.cliente_id
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      ${whereClause}
      ORDER BY ${fechaReferenciaCampo} DESC, v.venta_id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const dataParams = [...params, pageSizeNumber, offset];
    const result = await query(dataQuery, dataParams);

    res.json({
      ventas: result.rows,
      total,
      page: pageNumber,
      pageSize: pageSizeNumber,
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res
      .status(500)
      .json({ mensaje: 'Error al obtener ventas', error: error.message });
  }
};

const getVentasByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const ventasResult = await query(
      `SELECT v.venta_id, v.fecha, v.total, v.subtotal, v.descuento, v.cliente_id
       FROM ventas v
       WHERE v.cliente_id = $1
       ORDER BY v.fecha DESC
       LIMIT 50`,
      [clienteId]
    );

    if (ventasResult.rows.length === 0) {
      return res.json([]);
    }

    const ventaIds = ventasResult.rows.map((venta) => venta.venta_id);

    const itemsResult = await query(
      `SELECT vi.venta_id, vi.producto_id, vi.cantidad, vi.precio_unitario, vi.subtotal
       FROM ventas_items vi
       WHERE vi.venta_id = ANY($1::int[])`,
      [ventaIds]
    );

    const itemsByVenta = itemsResult.rows.reduce((acc, item) => {
      if (!acc[item.venta_id]) {
        acc[item.venta_id] = [];
      }
      acc[item.venta_id].push({
        producto_id: item.producto_id,
        productoId: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        precio: item.precio_unitario,
        subtotal: item.subtotal,
        total: item.subtotal,
      });
      return acc;
    }, {});

    const ventas = ventasResult.rows.map((venta) => ({
      ...venta,
      items: itemsByVenta[venta.venta_id] || [],
    }));

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas del cliente:', error);
    res.status(500).json({ mensaje: 'Error al obtener ventas del cliente', error: error.message });
  }
};

const getUltimaVenta = async (req, res) => {
  try {
    const result = await query(
      `SELECT v.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
              u.nombre as usuario_nombre, u.apellido as usuario_apellido
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.cliente_id
       LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
       ORDER BY v.venta_id DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(200).json(null);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener la última venta:', error);
    res.status(500).json({ mensaje: 'Error al obtener la última venta', error: error.message });
  }
};

const getVentaDetalle = async (req, res) => {
  try {
    const { ventaId } = req.params;

    const ventaResult = await query(
      `SELECT v.venta_id,
              v.numero_factura,
              v.fecha,
              v.subtotal,
              v.descuento,
              v.total,
              c.nombre AS cliente_nombre,
              c.apellido AS cliente_apellido,
              u.nombre AS usuario_nombre,
              u.apellido AS usuario_apellido,
              os.obra_social,
              os.descuento AS obra_social_descuento
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.cliente_id
       LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
       LEFT JOIN obras_sociales os ON c.obra_social_id = os.obra_social_id
       WHERE v.venta_id = $1`,
      [ventaId]
    );

    if (ventaResult.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    const venta = ventaResult.rows[0];

    const itemsResult = await query(
      `SELECT vi.item_id AS venta_item_id,
              vi.producto_id,
              p.nombre AS producto_nombre,
              vi.cantidad,
              vi.precio_unitario,
              vi.subtotal
       FROM ventas_items vi
       LEFT JOIN productos p ON vi.producto_id = p.producto_id
       WHERE vi.venta_id = $1
       ORDER BY vi.item_id`,
      [ventaId]
    );

    const items = itemsResult.rows.map((item) => ({
      item_id: item.venta_item_id,
      producto_id: item.producto_id,
      producto_nombre: item.producto_nombre,
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precio_unitario).toFixed(2),
      subtotal: Number(item.subtotal).toFixed(2),
    }));

    const totalSinDescuento = Number(venta.subtotal || 0);
    const rawDiscount = venta.descuento ?? 0;
    const discountFraction = typeof rawDiscount === 'number'
      ? (rawDiscount > 1 ? rawDiscount / 100 : rawDiscount)
      : 0;

    const descuentoMonto = totalSinDescuento * discountFraction;
    const subtotalConDescuento = totalSinDescuento - descuentoMonto;
    const ivaPorcentaje = 0.21;
    const ivaMonto = subtotalConDescuento * ivaPorcentaje;
    const totalConIva = subtotalConDescuento + ivaMonto;

    const fechaIso = venta.fecha
      ? new Date(venta.fecha).toISOString()
      : null;

    const numeroFactura = venta.numero_factura
      ? venta.numero_factura
      : String(venta.venta_id).padStart(8, '0');

    res.json({
      venta_id: venta.venta_id,
      numero_factura: numeroFactura,
      fecha: fechaIso,
      fecha_hora: fechaIso,
      cliente_nombre: venta.cliente_nombre,
      cliente_apellido: venta.cliente_apellido,
      usuario_nombre: venta.usuario_nombre,
      usuario_apellido: venta.usuario_apellido,
      obra_social: venta.obra_social,
      obra_social_descuento:
        venta.obra_social_descuento && venta.obra_social_descuento > 1
          ? Number(venta.obra_social_descuento) / 100
          : Number(venta.obra_social_descuento || 0),
      total_sin_descuento: totalSinDescuento.toFixed(2),
      descuento_porcentaje: (discountFraction * 100).toFixed(2),
      descuento_monto: descuentoMonto.toFixed(2),
      subtotal_con_descuento: subtotalConDescuento.toFixed(2),
      iva_porcentaje: (ivaPorcentaje * 100).toFixed(2),
      iva_monto: ivaMonto.toFixed(2),
      total: totalConIva.toFixed(2),
      items,
    });
  } catch (error) {
    console.error('Error al obtener detalle de venta:', error);
    res.status(500).json({ mensaje: 'Error al obtener detalle de venta', error: error.message });
  }
};

const createVenta = async (req, res) => {
  try {
    const {
      cliente_id,
      usuario_id,
      items,
      subtotal,
      descuento,
      total,
      forma_pago,
      numero_factura,
      fecha_hora,
    } = req.body;

    const client = await require('../config/database').getClient();
    try {
      await client.query('BEGIN');

      for (const item of items) {
        const stockResult = await client.query(
          'SELECT stock, nombre FROM productos WHERE producto_id = $1',
          [item.producto_id]
        );

        if (stockResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ mensaje: `Producto ${item.producto_id} no encontrado` });
        }

        if (Number(stockResult.rows[0].stock) < Number(item.cantidad)) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            mensaje: `Stock insuficiente para ${stockResult.rows[0].nombre}. Disponible: ${stockResult.rows[0].stock}`,
          });
        }
      }

      const numeroFacturaNormalizado = numero_factura
        ? String(numero_factura).padStart(8, '0')
        : null;

      let fechaVenta = null;
      if (fecha_hora) {
        const fechaParseada = new Date(fecha_hora);
        if (!isNaN(fechaParseada.getTime())) {
          fechaVenta = fechaParseada.toISOString();
        }
      }

      const ventaResult = await client.query(
        `INSERT INTO ventas (cliente_id, usuario_id, numero_factura, fecha, subtotal, descuento, total, forma_pago)
         VALUES ($1, $2, $3, COALESCE($4::timestamp, CURRENT_TIMESTAMP), $5, $6, $7, $8)
         RETURNING venta_id, numero_factura, fecha`,
        [
          cliente_id || null,
          usuario_id,
          numeroFacturaNormalizado,
          fechaVenta,
          subtotal,
          descuento || 0,
          total,
          forma_pago || null,
        ]
      );

      const ventaRow = ventaResult.rows[0];
      const venta_id = ventaRow.venta_id;
      let numeroFacturaAsignado = ventaRow.numero_factura;

      if (!numeroFacturaAsignado) {
        numeroFacturaAsignado = String(venta_id).padStart(8, '0');
        await client.query(
          `UPDATE ventas SET numero_factura = $1 WHERE venta_id = $2`,
          [numeroFacturaAsignado, venta_id]
        );
      }

      for (const item of items) {
        await client.query(
          `INSERT INTO ventas_items (venta_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [venta_id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
        );

        await client.query(
          `UPDATE productos SET stock = stock - $1 WHERE producto_id = $2`,
          [item.cantidad, item.producto_id]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({
        venta_id,
        numero_factura: numeroFacturaAsignado,
        mensaje: 'Venta creada correctamente',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ mensaje: 'Error al crear venta', error: error.message });
  }
};

// === REPORTES ===
const getReportes = async (req, res) => {
  try {
    const {
      dateSelectedFrom,
      dateSelectedTo,
      entitySelected,
      clienteProductoVendedor,
    } = req.query;

    const filters = [];
    const params = [];

    if (dateSelectedFrom) {
      params.push(dateSelectedFrom);
      filters.push(`v.fecha >= $${params.length}::date`);
    }

    if (dateSelectedTo) {
      params.push(dateSelectedTo);
      filters.push(`v.fecha < ($${params.length}::date + INTERVAL '1 day')`);
    }

    if (
      entitySelected === 'Cliente' &&
      clienteProductoVendedor &&
      !Number.isNaN(Number(clienteProductoVendedor))
    ) {
      params.push(Number(clienteProductoVendedor));
      filters.push(`v.cliente_id = $${params.length}`);
    }

    if (
      entitySelected === 'Vendedor' &&
      clienteProductoVendedor &&
      !Number.isNaN(Number(clienteProductoVendedor))
    ) {
      params.push(Number(clienteProductoVendedor));
      filters.push(`v.usuario_id = $${params.length}`);
    }

    if (
      entitySelected === 'Producto' &&
      clienteProductoVendedor &&
      !Number.isNaN(Number(clienteProductoVendedor))
    ) {
      params.push(Number(clienteProductoVendedor));
      const placeholder = `$${params.length}`;
      filters.push(
        `EXISTS (SELECT 1 FROM ventas_items vi WHERE vi.venta_id = v.venta_id AND vi.producto_id = ${placeholder})`
      );
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const queryText = `
      SELECT
        DATE(v.fecha) AS fecha,
        COUNT(*) AS cantidad_ventas,
        COALESCE(SUM(v.total), 0) AS monto_total
      FROM ventas v
      ${whereClause}
      GROUP BY DATE(v.fecha)
      ORDER BY DATE(v.fecha)
    `;

    const result = await query(queryText, params);

    res.json(result.rows ?? []);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res
      .status(500)
      .json({ mensaje: 'Error al obtener reportes', error: error.message });
  }
};

// === Utilidades Auditoría ===
const parseJsonField = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === 'object' && !Buffer.isBuffer(value)) {
    return value;
  }

  try {
    const parsed =
      Buffer.isBuffer(value) ? JSON.parse(value.toString()) : JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (_error) {
    return {};
  }
};

const buildChanges = (before, after) => {
  const keys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {}),
  ]);

  return Array.from(keys)
    .map((field) => ({
      campo: field,
      anterior:
        before && Object.prototype.hasOwnProperty.call(before, field)
          ? before[field]
          : null,
      nuevo:
        after && Object.prototype.hasOwnProperty.call(after, field)
          ? after[field]
          : null,
    }))
    .filter(
      ({ anterior, nuevo }) =>
        anterior !== nuevo &&
        !(anterior === null && (nuevo === null || nuevo === undefined)) &&
        !(nuevo === null && (anterior === null || anterior === undefined))
    );
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

const buildSummaryText = (accion, cambios, label) => {
  const nombreEntidad = label || 'el registro';

  if (accion === 'CREAR') {
    return `Se creó ${nombreEntidad}`;
  }

  if (accion === 'ELIMINAR') {
    return `Se eliminó ${nombreEntidad}`;
  }

  if (cambios.length === 0) {
    return `Se modificó ${nombreEntidad} sin cambios visibles`;
  }

  const detalles = cambios.map(
    ({ campo, anterior, nuevo }) =>
      `${campo}: ${formatValue(anterior)} → ${formatValue(nuevo)}`
  );

  const prefijo = `Se actualizaron ${detalles.length} campo${
    detalles.length > 1 ? 's' : ''
  } en ${nombreEntidad}`;

  return `${prefijo}: ${detalles.join('; ')}`;
};

const formatAuditRow = (row, options) => {
  const { entityKey, getLabel } =
    typeof options === 'string' ? { entityKey: options } : options;
  const before = parseJsonField(row.datos_anteriores);
  const after = parseJsonField(row.datos_nuevos);
  const cambios = buildChanges(before, after);
  const displayLabel = getLabel
    ? getLabel(before, after, row)
    : after?.[entityKey] || before?.[entityKey] || row[entityKey] || null;
  const resumen = buildSummaryText(row.accion, cambios, displayLabel);

  return {
    auditoria_id: row.auditoria_id,
    fecha: row.fecha,
    accion: row.accion,
    [entityKey]: displayLabel,
    usuario: row.usuario || 'Sistema',
    cambios,
    resumen,
  };
};

// === AUDITORIA ===
const getAuditoria = async (req, res) => {
  try {
    const { tipo, id } = req.query;
    
    let queryText = '';
    if (tipo === 'productos') {
      queryText = `SELECT * FROM auditoria_productos WHERE producto_id = $1 ORDER BY fecha DESC`;
    } else if (tipo === 'clientes') {
      queryText = `SELECT * FROM auditoria_clientes WHERE cliente_id = $1 ORDER BY fecha DESC`;
    } else if (tipo === 'obras_sociales') {
      queryText = `SELECT * FROM auditoria_obras_sociales WHERE obra_social_id = $1 ORDER BY fecha DESC`;
    }
    
    if (queryText) {
      const result = await query(queryText, [id]);
      res.json({ auditoria: result.rows });
    } else {
      res.json({ auditoria: [] });
    }
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    res.status(500).json({ mensaje: 'Error al obtener auditoría', error: error.message });
  }
};

const getAuditoriaProductosList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const limit = Math.max(parseInt(pageSize, 10) || 10, 1);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const params = [];
    let paramIndex = 1;
    let whereClause = "";

    if (search) {
      whereClause = `WHERE (COALESCE(p.nombre, '') ILIKE $${paramIndex} OR COALESCE(ap.accion, '') ILIKE $${paramIndex} OR COALESCE(u.nombre, '') ILIKE $${paramIndex} OR COALESCE(u.apellido, '') ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex += 1;
    }

    const limitParam = paramIndex++;
    const offsetParam = paramIndex++;

    params.push(limit, offset);

    const queryText = `SELECT ap.auditoria_id, ap.fecha, ap.accion,
                              p.nombre AS producto,
                              u.nombre || ' ' || u.apellido AS usuario,
                              ap.datos_anteriores,
                              ap.datos_nuevos
                       FROM auditoria_productos ap
                       LEFT JOIN productos p ON ap.producto_id = p.producto_id
                       LEFT JOIN usuarios u ON ap.usuario_id = u.usuario_id
                       ${whereClause}
                       ORDER BY ap.fecha DESC
                       LIMIT $${limitParam} OFFSET $${offsetParam}`;

    const result = await query(queryText, params);
    const formatted = result.rows.map((row) =>
      formatAuditRow(row, {
        entityKey: 'producto',
        getLabel: (before, after, current) =>
          after?.nombre ||
          before?.nombre ||
          current.producto ||
          null,
      })
    );
    res.json(formatted);
  } catch (error) {
    console.error('Error al obtener auditoría de productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener auditoría de productos', error: error.message });
  }
};

const getAuditoriaClientesList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const limit = Math.max(parseInt(pageSize, 10) || 10, 1);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const params = [];
    let paramIndex = 1;
    let whereClause = "";

    if (search) {
      whereClause = `WHERE (COALESCE(c.nombre, '') ILIKE $${paramIndex} OR COALESCE(c.apellido, '') ILIKE $${paramIndex} OR COALESCE(ac.accion, '') ILIKE $${paramIndex} OR COALESCE(u.nombre, '') ILIKE $${paramIndex} OR COALESCE(u.apellido, '') ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex += 1;
    }

    const limitParam = paramIndex++;
    const offsetParam = paramIndex++;

    params.push(limit, offset);

    const queryText = `SELECT ac.auditoria_id, ac.fecha, ac.accion,
                              c.nombre || ' ' || c.apellido AS cliente,
                              u.nombre || ' ' || u.apellido AS usuario,
                              ac.datos_anteriores,
                              ac.datos_nuevos
                       FROM auditoria_clientes ac
                       LEFT JOIN clientes c ON ac.cliente_id = c.cliente_id
                       LEFT JOIN usuarios u ON ac.usuario_id = u.usuario_id
                       ${whereClause}
                       ORDER BY ac.fecha DESC
                       LIMIT $${limitParam} OFFSET $${offsetParam}`;

    const result = await query(queryText, params);
    const formatted = result.rows.map((row) =>
      formatAuditRow(row, {
        entityKey: 'cliente',
        getLabel: (before, after, current) => {
          const fallbackAfter = [after?.nombre, after?.apellido]
            .filter(Boolean)
            .join(' ')
            .trim();
          const fallbackBefore = [before?.nombre, before?.apellido]
            .filter(Boolean)
            .join(' ')
            .trim();

          return (
            (fallbackAfter.length > 0 ? fallbackAfter : null) ||
            (fallbackBefore.length > 0 ? fallbackBefore : null) ||
            current.cliente ||
            null
          );
        },
      })
    );
    res.json(formatted);
  } catch (error) {
    console.error('Error al obtener auditoría de clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener auditoría de clientes', error: error.message });
  }
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'sí';
  }
  return false;
};

const createBadRequestError = (message) => {
  const error = new Error(message);
  error.isBadRequest = true;
  return error;
};

const buildLiquidacionObrasSocialesData = async (rawFilters = {}) => {
  const {
    obraSocialId,
    fechaDesde,
    fechaHasta,
    incluirSinObraSocial,
  } = rawFilters;

  const includeWithoutObraSocial = parseBoolean(incluirSinObraSocial);

  const params = [];
  const conditions = [];

  let obraSocialIdNumber = null;
  if (obraSocialId !== undefined && obraSocialId !== null && `${obraSocialId}`.trim() !== '') {
    obraSocialIdNumber = Number(obraSocialId);
    if (Number.isNaN(obraSocialIdNumber)) {
      throw createBadRequestError('obraSocialId debe ser numérico');
    }
    params.push(obraSocialIdNumber);
    conditions.push(`os.obra_social_id = $${params.length}`);
  } else if (!includeWithoutObraSocial) {
    conditions.push('os.obra_social_id IS NOT NULL');
  }

  let parsedFechaDesde = null;
  if (fechaDesde) {
    parsedFechaDesde = new Date(fechaDesde);
    if (Number.isNaN(parsedFechaDesde.getTime())) {
      throw createBadRequestError('fechaDesde inválida');
    }
    params.push(parsedFechaDesde);
    conditions.push(`v.fecha >= $${params.length}`);
  }

  let parsedFechaHasta = null;
  if (fechaHasta) {
    parsedFechaHasta = new Date(fechaHasta);
    if (Number.isNaN(parsedFechaHasta.getTime())) {
      throw createBadRequestError('fechaHasta inválida');
    }
    parsedFechaHasta.setHours(23, 59, 59, 999);
    params.push(parsedFechaHasta);
    conditions.push(`v.fecha <= $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const queryText = `
      SELECT
        v.venta_id,
        v.numero_factura,
        v.fecha,
        v.subtotal,
        v.descuento,
        v.total,
        v.forma_pago,
        c.cliente_id,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.dni AS cliente_dni,
        os.obra_social_id,
        os.obra_social,
        os.plan
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.cliente_id
      LEFT JOIN obras_sociales os ON c.obra_social_id = os.obra_social_id
      ${whereClause}
      ORDER BY v.fecha DESC, v.venta_id DESC
    `;

  const result = await query(queryText, params);
  const rows = result.rows || [];

  const agrupadas = rows.reduce((acc, row) => {
    const obraSocialKey = row.obra_social_id || 'sin-obra';
    if (!acc[obraSocialKey]) {
      acc[obraSocialKey] = {
        obra_social_id: row.obra_social_id,
        obra_social: row.obra_social || 'Sin obra social',
        plan: row.plan || null,
        cantidad_ventas: 0,
        subtotal_total: 0,
        descuento_total: 0,
        total_paciente: 0,
        aporte_obra_social: 0,
        detalle: [],
      };
    }

    const subtotal = Number(row.subtotal ?? 0);
    const descuentoValor = Number(row.descuento ?? 0);
    const descuentoFraccion = descuentoValor > 1 ? descuentoValor / 100 : descuentoValor;
    const descuentoMonto = subtotal * descuentoFraccion;
    const totalPaciente = Number(row.total ?? (subtotal - descuentoMonto));
    const aporteObraSocial = descuentoMonto;

    acc[obraSocialKey].cantidad_ventas += 1;
    acc[obraSocialKey].subtotal_total += subtotal;
    acc[obraSocialKey].descuento_total += descuentoMonto;
    acc[obraSocialKey].total_paciente += totalPaciente;
    acc[obraSocialKey].aporte_obra_social += aporteObraSocial;
    acc[obraSocialKey].detalle.push({
      venta_id: row.venta_id,
      numero_factura: row.numero_factura || String(row.venta_id).padStart(8, '0'),
      fecha: row.fecha,
      cliente: {
        cliente_id: row.cliente_id,
        nombre: row.cliente_nombre,
        apellido: row.cliente_apellido,
        dni: row.cliente_dni,
      },
      subtotal,
      descuento_porcentaje: descuentoValor > 1 ? descuentoValor : descuentoValor * 100,
      descuento_monto: descuentoMonto,
      total_paciente: totalPaciente,
      aporte_obra_social: aporteObraSocial,
      forma_pago: row.forma_pago,
    });

    return acc;
  }, {});

  const resumen = Object.values(agrupadas).map((item) => ({
    ...item,
    subtotal_total: Number(item.subtotal_total.toFixed(2)),
    descuento_total: Number(item.descuento_total.toFixed(2)),
    total_paciente: Number(item.total_paciente.toFixed(2)),
    aporte_obra_social: Number(item.aporte_obra_social.toFixed(2)),
  }));

  const totales = resumen.reduce(
    (acc, item) => ({
      cantidad_ventas: acc.cantidad_ventas + item.cantidad_ventas,
      subtotal_total: Number((acc.subtotal_total + item.subtotal_total).toFixed(2)),
      descuento_total: Number((acc.descuento_total + item.descuento_total).toFixed(2)),
      total_paciente: Number((acc.total_paciente + item.total_paciente).toFixed(2)),
      aporte_obra_social: Number((acc.aporte_obra_social + item.aporte_obra_social).toFixed(2)),
    }),
    {
      cantidad_ventas: 0,
      subtotal_total: 0,
      descuento_total: 0,
      total_paciente: 0,
      aporte_obra_social: 0,
    }
  );

  return {
    filtros: {
      obraSocialId: obraSocialIdNumber,
      fechaDesde: fechaDesde || null,
      fechaHasta: fechaHasta || null,
      incluirSinObraSocial: includeWithoutObraSocial,
    },
    resumen,
    totales,
    totalRegistros: rows.length,
  };
};

const getAuditoriaObrasSocialesList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const limit = Math.max(parseInt(pageSize, 10) || 10, 1);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const params = [];
    let paramIndex = 1;
    let whereClause = "";

    if (search) {
      whereClause = `WHERE (COALESCE(os.obra_social, '') ILIKE $${paramIndex} OR COALESCE(aos.accion, '') ILIKE $${paramIndex} OR COALESCE(u.nombre, '') ILIKE $${paramIndex} OR COALESCE(u.apellido, '') ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex += 1;
    }

    const limitParam = paramIndex++;
    const offsetParam = paramIndex++;

    params.push(limit, offset);

    const queryText = `SELECT aos.auditoria_id, aos.fecha, aos.accion,
                              os.obra_social,
                              u.nombre || ' ' || u.apellido AS usuario,
                              aos.datos_anteriores,
                              aos.datos_nuevos
                       FROM auditoria_obras_sociales aos
                       LEFT JOIN obras_sociales os ON aos.obra_social_id = os.obra_social_id
                       LEFT JOIN usuarios u ON aos.usuario_id = u.usuario_id
                       ${whereClause}
                       ORDER BY aos.fecha DESC
                       LIMIT $${limitParam} OFFSET $${offsetParam}`;

    const result = await query(queryText, params);
    const formatted = result.rows.map((row) =>
      formatAuditRow(row, {
        entityKey: 'obra_social',
        getLabel: (before, after, current) =>
          after?.obra_social ||
          before?.obra_social ||
          current.obra_social ||
          null,
      })
    );
    res.json(formatted);
  } catch (error) {
    console.error('Error al obtener auditoría de obras sociales:', error);
    res.status(500).json({ mensaje: 'Error al obtener auditoría de obras sociales', error: error.message });
  }
};

const getAuditoriaObrasSocialesLiquidacion = async (req, res) => {
  try {
    const data = await buildLiquidacionObrasSocialesData(req.query);
    res.json(data);
  } catch (error) {
    if (error.isBadRequest) {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error al obtener liquidación de obras sociales:', error);
    res.status(500).json({
      mensaje: 'Error al obtener liquidación de obras sociales',
      error: error.message,
    });
  }
};

const sendAuditoriaObrasSocialesLiquidacionEmail = async (req, res) => {
  try {
    const { to, subject } = req.body || {};

    if (!to || (typeof to === 'string' && to.trim() === '')) {
      return res.status(400).json({ mensaje: 'El correo destino es requerido' });
    }

    const data = await buildLiquidacionObrasSocialesData(req.body);

    await sendLiquidacionObrasSocialesEmail({
      to: Array.isArray(to) ? to : `${to}`.split(',').map((email) => email.trim()).filter(Boolean),
      subject,
      resumen: data.resumen,
      totales: data.totales,
      filtros: data.filtros,
      totalRegistros: data.totalRegistros,
    });

    res.json({
      mensaje: 'Liquidación enviada correctamente',
      enviados: Array.isArray(to) ? to.length : `${to}`.split(',').filter((email) => email.trim()).length,
    });
  } catch (error) {
    if (error.isBadRequest) {
      return res.status(400).json({ mensaje: error.message });
    }
    if (error.code === 'SMTP_NOT_CONFIGURED') {
      return res.status(503).json({ mensaje: 'No hay configuración SMTP para enviar correos' });
    }
    const smtpConnectionErrors = new Set([
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ECONNECTION',
      'ESOCKET',
      'EAUTH',
      'EENVELOPE',
    ]);
    if (smtpConnectionErrors.has(error.code)) {
      return res.status(502).json({
        mensaje: 'No fue posible conectarse al servidor SMTP. Verifica host, puerto y credenciales.',
      });
    }
    console.error('Error al enviar liquidación por correo:', error);
    res.status(500).json({
      mensaje: 'Error al enviar liquidación por correo',
      error: error.message,
    });
  }
};

module.exports = {
  // Clientes
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  // Obras Sociales
  getObrasSociales,
  createObraSocial,
  updateObraSocial,
  deleteObraSocial,
  // Proveedores
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  // Sesiones
  getSesiones,
  // Ventas
  getVentas,
  getUltimaVenta,
  getVentasByCliente,
  getVentaDetalle,
  createVenta,
  // Auditoría listas
  getAuditoriaProductosList,
  getAuditoriaClientesList,
  getAuditoriaObrasSocialesList,
  getAuditoriaObrasSocialesLiquidacion,
  sendAuditoriaObrasSocialesLiquidacionEmail,
  // Reportes
  getReportes,
  // Auditoría
  getAuditoria
};

