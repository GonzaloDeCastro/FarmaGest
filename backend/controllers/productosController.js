// Controlador de productos
const { query } = require('../config/database');

// Obtener productos con paginación
const getProductos = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '', sesion = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE p.activo = true';
    const params = [];
    let paramCount = 0;
    
    if (search) {
      paramCount++;
      whereClause += ` AND (p.nombre ILIKE $${paramCount} OR p.codigo ILIKE $${paramCount} OR p.marca ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    // Contar total
    const countResult = await query(`SELECT COUNT(*) as total FROM productos p ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Obtener productos
    params.push(pageSize, offset);
    
    const productosQuery = `
      SELECT 
        p.producto_id,
        p.nombre,
        p.codigo,
        p.marca,
        p.precio,
        p.stock,
        p.categoria_id,
        c.categoria,
        p.proveedor_id,
        pr.razon_social as proveedor
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.proveedor_id
      ${whereClause}
      ORDER BY p.producto_id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    
    const result = await query(productosQuery, params);
    
    res.json({
      productos: result.rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

// Obtener categorías
const getCategorias = async (req, res) => {
  try {
    const result = await query('SELECT categoria_id, categoria, descripcion FROM categorias ORDER BY categoria');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
  }
};

// Crear producto
const createProducto = async (req, res) => {
  try {
    const { nombre, codigo, marca, categoria_id, precio, stock, proveedor_id, usuario_id } = req.body;
    
    if (!nombre || !codigo || precio === undefined || stock === undefined) {
      return res.status(400).json({ mensaje: 'Nombre, código, precio y stock son requeridos' });
    }
    
    // Verificar si el código ya existe
    const existente = await query('SELECT producto_id FROM productos WHERE codigo = $1', [codigo]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ mensaje: 'El código de producto ya existe' });
    }
    
    const result = await query(
      `INSERT INTO productos (nombre, codigo, marca, categoria_id, precio, stock, proveedor_id, usuario_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING producto_id`,
      [nombre, codigo, marca || null, categoria_id || null, precio, stock, proveedor_id || null, usuario_id || null]
    );
    
    // Obtener producto creado
    const productoResult = await query(
      `SELECT p.*, c.categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.categoria_id WHERE p.producto_id = $1`,
      [result.rows[0].producto_id]
    );
    
    res.status(201).json(productoResult.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

// Actualizar producto
const updateProducto = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const { nombre, codigo, marca, categoria_id, precio, stock, proveedor_id } = req.body;
    
    // Verificar si existe
    const existe = await query('SELECT producto_id FROM productos WHERE producto_id = $1', [producto_id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Verificar código único si se cambia
    if (codigo) {
      const codigoExistente = await query(
        'SELECT producto_id FROM productos WHERE codigo = $1 AND producto_id != $2',
        [codigo, producto_id]
      );
      if (codigoExistente.rows.length > 0) {
        return res.status(409).json({ mensaje: 'El código de producto ya existe' });
      }
    }
    
    await query(
      `UPDATE productos SET nombre = $1, codigo = $2, marca = $3, categoria_id = $4, precio = $5, stock = $6, proveedor_id = $7
       WHERE producto_id = $8`,
      [nombre, codigo, marca || null, categoria_id || null, precio, stock, proveedor_id || null, producto_id]
    );
    
    // Obtener producto actualizado
    const result = await query(
      `SELECT p.*, c.categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.categoria_id WHERE p.producto_id = $1`,
      [producto_id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar producto (soft delete)
const deleteProducto = async (req, res) => {
  try {
    const { producto_id } = req.params;
    await query('UPDATE productos SET activo = false WHERE producto_id = $1', [producto_id]);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = {
  getProductos,
  getCategorias,
  createProducto,
  updateProducto,
  deleteProducto
};

