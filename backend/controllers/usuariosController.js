// Controlador de usuarios
const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener usuarios con paginación y filtros
const getUsuarios = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '', rolID = '', sesion = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE u.activo = true';
    const params = [];
    let paramCount = 0;
    
    if (search) {
      paramCount++;
      whereClause += ` AND (u.nombre ILIKE $${paramCount} OR u.apellido ILIKE $${paramCount} OR u.correo ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    if (rolID) {
      paramCount++;
      whereClause += ` AND u.rol_id = $${paramCount}`;
      params.push(rolID);
    }
    
    // Contar total
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM usuarios u 
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Obtener usuarios
    paramCount++;
    params.push(pageSize);
    paramCount++;
    params.push(offset);
    
    const usuariosQuery = `
      SELECT 
        u.usuario_id,
        u.nombre as Nombre,
        u.apellido as Apellido,
        u.correo as Correo,
        u.activo,
        u.rol_id,
        r.rol as Rol,
        r.rol_id as rol_id
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.rol_id
      ${whereClause}
      ORDER BY u.usuario_id DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `;
    
    const usuariosResult = await query(usuariosQuery, params);
    
    res.json({
      usuarios: usuariosResult.rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener roles
const getRoles = async (req, res) => {
  try {
    const result = await query('SELECT rol_id, rol, descripcion FROM roles ORDER BY rol_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ mensaje: 'Error al obtener roles', error: error.message });
  }
};

// Login de usuario
const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena, ip_address, user_agent } = req.query;
    
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }
    
    // Buscar usuario
    const usuarioResult = await query(
      'SELECT u.*, r.rol FROM usuarios u LEFT JOIN roles r ON u.rol_id = r.rol_id WHERE u.correo = $1 AND u.activo = true',
      [correo]
    );
    
    if (usuarioResult.rows.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }
    
    const usuario = usuarioResult.rows[0];
    
    // Verificar contraseña (comparar hash con bcrypt)
    const passwordValid = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!passwordValid) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }
    
    // Crear sesión
    const sesionResult = await query(
      `INSERT INTO sesiones (usuario_id, ip_address, user_agent, activo, fecha_inicio)
       VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)
       RETURNING sesion_id`,
      [usuario.usuario_id, ip_address || null, user_agent || null]
    );
    
    // Retornar datos del usuario (sin contraseña)
    // Permisos por rol (map estático hasta implementar tabla de permisos)
    const permisosPorRol = {
      administrador: [
        'gestion_productos',
        'gestion_ventas',
        'gestion_clientes',
        'gestion_proveedores',
        'gestion_obras_sociales',
        'gestion_usuarios',
        'gestion_pedidos'
      ],
      admin: [
        'gestion_productos',
        'gestion_ventas',
        'gestion_clientes',
        'gestion_proveedores',
        'gestion_obras_sociales',
        'gestion_usuarios',
        'gestion_pedidos'
      ],
      vendedor: [
        'gestion_productos',
        'gestion_ventas',
        'gestion_clientes'
      ],
      cajero: [
        'gestion_ventas'
      ],
      farmaceutico: [
        'gestion_productos',
        'gestion_ventas',
        'gestion_clientes',
        'gestion_proveedores',
        'gestion_obras_sociales'
      ],
    };

    const normalizeRolKey = (rol = '') =>
      rol
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

    const rolKey = usuario.rol ? normalizeRolKey(usuario.rol) : '';
    const permisos = permisosPorRol[rolKey] || [];

    const usuarioResponse = {
      usuario_id: usuario.usuario_id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
      rol_id: usuario.rol_id,
      sesion_id: sesionResult.rows[0].sesion_id,
      permisos,
    };
    
    res.json(usuarioResponse);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el login', error: error.message });
  }
};

// Crear usuario
const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, rol_id } = req.body;
    
    if (!nombre || !apellido || !correo || !contrasena || !rol_id) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }
    
    // Verificar si el correo ya existe
    const existente = await query('SELECT usuario_id FROM usuarios WHERE correo = $1', [correo]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    // Insertar usuario
    const result = await query(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id, activo)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING usuario_id, nombre, apellido, correo, rol_id`,
      [nombre, apellido, correo, hashedPassword, rol_id]
    );
    
    // Obtener rol
    const rolResult = await query('SELECT rol FROM roles WHERE rol_id = $1', [rol_id]);
    
    res.status(201).json({
      usuario_id: result.rows[0].usuario_id,
      Nombre: result.rows[0].nombre,
      Apellido: result.rows[0].apellido,
      Correo: result.rows[0].correo,
      rol_id: result.rows[0].rol_id,
      Rol: rolResult.rows[0].rol
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { nombre, apellido, correo, rol_id } = req.body;
    
    // Verificar si existe
    const existe = await query('SELECT usuario_id FROM usuarios WHERE usuario_id = $1', [usuario_id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    // Verificar si el correo ya existe en otro usuario
    if (correo) {
      const correoExistente = await query(
        'SELECT usuario_id FROM usuarios WHERE correo = $1 AND usuario_id != $2',
        [correo, usuario_id]
      );
      if (correoExistente.rows.length > 0) {
        return res.status(409).json({ mensaje: 'El correo ya está registrado' });
      }
    }
    
    // Actualizar
    const updateFields = [];
    const params = [];
    let paramCount = 0;
    
    if (nombre) {
      paramCount++;
      updateFields.push(`nombre = $${paramCount}`);
      params.push(nombre);
    }
    if (apellido) {
      paramCount++;
      updateFields.push(`apellido = $${paramCount}`);
      params.push(apellido);
    }
    if (correo) {
      paramCount++;
      updateFields.push(`correo = $${paramCount}`);
      params.push(correo);
    }
    if (rol_id) {
      paramCount++;
      updateFields.push(`rol_id = $${paramCount}`);
      params.push(rol_id);
    }
    
    paramCount++;
    params.push(usuario_id);
    
    await query(
      `UPDATE usuarios SET ${updateFields.join(', ')} WHERE usuario_id = $${paramCount}`,
      params
    );
    
    // Obtener usuario actualizado
    const result = await query(
      `SELECT u.*, r.rol FROM usuarios u LEFT JOIN roles r ON u.rol_id = r.rol_id WHERE u.usuario_id = $1`,
      [usuario_id]
    );
    
    res.json({
      usuario_id: result.rows[0].usuario_id,
      Nombre: result.rows[0].nombre,
      Apellido: result.rows[0].apellido,
      Correo: result.rows[0].correo,
      rol_id: result.rows[0].rol_id,
      Rol: result.rows[0].rol
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario (soft delete)
const deleteUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    await query('UPDATE usuarios SET activo = false WHERE usuario_id = $1', [usuario_id]);
    
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

// Actualizar contraseña
const updatePassword = async (req, res) => {
  try {
    const { correo } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ mensaje: 'La nueva contraseña es requerida' });
    }
    
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await query(
      'UPDATE usuarios SET contrasena = $1 WHERE correo = $2',
      [hashedPassword, correo]
    );
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al actualizar contraseña', error: error.message });
  }
};

// Logout de usuario
const logoutUsuario = async (req, res) => {
  try {
    const { sesion_id } = req.params;

    if (!sesion_id) {
      return res.status(400).json({ mensaje: 'Sesión inválida' });
    }

    await query(
      `UPDATE sesiones
       SET activo = false,
           fecha_fin = CURRENT_TIMESTAMP
       WHERE sesion_id = $1`,
      [sesion_id]
    );

    res.json({ mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ mensaje: 'Error al cerrar sesión', error: error.message });
  }
};
 
module.exports = {
  getUsuarios,
  getRoles,
  loginUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  updatePassword,
  logoutUsuario
};

