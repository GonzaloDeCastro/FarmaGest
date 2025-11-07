// Controladores básicos para otros módulos (estructura inicial)
const { query } = require('../config/database');

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
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    
    const result = await query(
      `SELECT v.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido, u.nombre as usuario_nombre
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.cliente_id
       LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
       ORDER BY v.fecha DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );
    
    res.json({ ventas: result.rows });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ mensaje: 'Error al obtener ventas', error: error.message });
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
    const { tipo, fecha_inicio, fecha_fin } = req.query;
    
    // Implementar reportes básicos
    res.json({ mensaje: 'Reportes - Implementar según necesidades' });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes', error: error.message });
  }
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
    res.json(result.rows);
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
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener auditoría de clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener auditoría de clientes', error: error.message });
  }
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
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener auditoría de obras sociales:', error);
    res.status(500).json({ mensaje: 'Error al obtener auditoría de obras sociales', error: error.message });
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
  // Reportes
  getReportes,
  // Auditoría
  getAuditoria
};

