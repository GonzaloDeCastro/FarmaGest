const { query } = require('../config/database');

const getCiudades = async (req, res) => {
  try {
    const result = await query(
      `SELECT ciudad_id, ciudad
       FROM ciudades
       ORDER BY ciudad_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).json({ mensaje: 'Error al obtener ciudades', error: error.message });
  }
};

module.exports = {
  getCiudades,
};

