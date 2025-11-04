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

const createVenta = async (req, res) => {
  try {
    const { cliente_id, usuario_id, items, subtotal, descuento, total, forma_pago } = req.body;
    
    const client = await require('../config/database').getClient();
    try {
      await client.query('BEGIN');
      
      // Crear venta
      const ventaResult = await client.query(
        `INSERT INTO ventas (cliente_id, usuario_id, subtotal, descuento, total, forma_pago)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING venta_id`,
        [cliente_id || null, usuario_id, subtotal, descuento || 0, total, forma_pago || null]
      );
      
      const venta_id = ventaResult.rows[0].venta_id;
      
      // Crear items
      for (const item of items) {
        await client.query(
          `INSERT INTO ventas_items (venta_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [venta_id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
        );
        
        // Actualizar stock
        await client.query(
          `UPDATE productos SET stock = stock - $1 WHERE producto_id = $2`,
          [item.cantidad, item.producto_id]
        );
      }
      
      await client.query('COMMIT');
      res.status(201).json({ venta_id, mensaje: 'Venta creada correctamente' });
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
  createVenta,
  // Reportes
  getReportes,
  // Auditoría
  getAuditoria
};

