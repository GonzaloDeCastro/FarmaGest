const { query } = require('../config/database');

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

module.exports = {
  getObrasSociales,
  createObraSocial,
  updateObraSocial,
  deleteObraSocial,
};
