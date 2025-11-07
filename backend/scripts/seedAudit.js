const { query, pool } = require('../config/database');

async function seedAudit() {
  try {
    await query(
      `INSERT INTO auditoria_productos (producto_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        1,
        'ACTUALIZAR',
        JSON.stringify({ precio: '4000.00' }),
        JSON.stringify({ precio: '4200.00' }),
      ]
    );

    await query(
      `INSERT INTO auditoria_clientes (cliente_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        1,
        'MODIFICAR',
        JSON.stringify({ telefono: '11111111' }),
        JSON.stringify({ telefono: '22222222' }),
      ]
    );

    await query(
      `INSERT INTO auditoria_obras_sociales (obra_social_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        1,
        'CREAR',
        JSON.stringify({}),
        JSON.stringify({ obra_social: 'Prueba Audit', descuento: 0.15 }),
      ]
    );

    await query(
      `INSERT INTO auditoria_productos (producto_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        2,
        'CREAR',
        JSON.stringify({}),
        JSON.stringify({ nombre: 'Vitaminas C', precio: '1500.00' }),
      ]
    );

    await query(
      `INSERT INTO auditoria_productos (producto_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        3,
        'ELIMINAR',
        JSON.stringify({ stock: 5 }),
        JSON.stringify({}),
      ]
    );

    await query(
      `INSERT INTO auditoria_clientes (cliente_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        2,
        'CREAR',
        JSON.stringify({}),
        JSON.stringify({ nombre: 'Ana', apellido: 'Frank', dni: '30111222' }),
      ]
    );

    await query(
      `INSERT INTO auditoria_clientes (cliente_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        1,
        'ELIMINAR',
        JSON.stringify({ nombre: 'Pedro', apellido: 'Tuella' }),
        JSON.stringify({}),
      ]
    );

    await query(
      `INSERT INTO auditoria_obras_sociales (obra_social_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        2,
        'ACTUALIZAR',
        JSON.stringify({ obra_social: 'Swiss Medical', descuento: 0.1 }),
        JSON.stringify({ obra_social: 'Swiss Medical', descuento: 0.2 }),
      ]
    );

    await query(
      `INSERT INTO auditoria_obras_sociales (obra_social_id, usuario_id, accion, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`
       ,
      [
        1,
        1,
        'ELIMINAR',
        JSON.stringify({ obra_social: 'IOMA', descuento: 0.05 }),
        JSON.stringify({}),
      ]
    );

    console.log('✅ Registros de auditoría insertados');
  } catch (error) {
    console.error('❌ Error insertando auditoría:', error);
  } finally {
    await pool.end();
  }
}

seedAudit();
