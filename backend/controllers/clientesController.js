const { query } = require('../config/database');

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

module.exports = {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};
