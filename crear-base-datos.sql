-- Script para crear la base de datos FarmaGest en PostgreSQL
-- Ejecutar este script como usuario postgres o superusuario

-- ============================================
-- 1. CREAR BASE DE DATOS
-- ============================================

-- Eliminar base de datos si existe (CUIDADO: Esto borra todos los datos)
-- DROP DATABASE IF EXISTS farmagest;

-- Crear la base de datos
CREATE DATABASE farmagest
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar a la base de datos
\c farmagest

-- ============================================
-- 2. CREAR ESQUEMA Y CONFIGURACIÓN
-- ============================================

-- Habilitar extensión para UUID (si se necesita)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 3. CREAR TABLAS
-- ============================================

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    rol_id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(rol_id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ciudades
CREATE TABLE IF NOT EXISTS ciudades (
    ciudad_id SERIAL PRIMARY KEY,
    ciudad VARCHAR(100) NOT NULL UNIQUE,
    provincia VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de obras sociales
CREATE TABLE IF NOT EXISTS obras_sociales (
    obra_social_id SERIAL PRIMARY KEY,
    obra_social VARCHAR(100) NOT NULL,
    plan VARCHAR(100),
    descuento DECIMAL(5,2) DEFAULT 0,
    codigo VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    obra_social_id INTEGER REFERENCES obras_sociales(obra_social_id) ON DELETE SET NULL,
    ciudad_id INTEGER REFERENCES ciudades(ciudad_id) ON DELETE SET NULL,
    usuario_id INTEGER REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS categorias (
    categoria_id SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    proveedor_id SERIAL PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    email VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    marca VARCHAR(100),
    categoria_id INTEGER REFERENCES categorias(categoria_id) ON DELETE SET NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    proveedor_id INTEGER REFERENCES proveedores(proveedor_id) ON DELETE SET NULL,
    usuario_id INTEGER REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    venta_id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(cliente_id) ON DELETE SET NULL,
    usuario_id INTEGER REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    numero_factura VARCHAR(50) UNIQUE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    forma_pago VARCHAR(50),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de venta
CREATE TABLE IF NOT EXISTS ventas_items (
    item_id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(venta_id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(producto_id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sesiones (
    sesion_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditoría de productos
CREATE TABLE IF NOT EXISTS auditoria_productos (
    auditoria_id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(producto_id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditoría de clientes
CREATE TABLE IF NOT EXISTS auditoria_clientes (
    auditoria_id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditoría de obras sociales
CREATE TABLE IF NOT EXISTS auditoria_obras_sociales (
    auditoria_id SERIAL PRIMARY KEY,
    obra_social_id INTEGER NOT NULL REFERENCES obras_sociales(obra_social_id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. CREAR ÍNDICES
-- ============================================

-- Índices para mejorar el rendimiento de búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX IF NOT EXISTS idx_clientes_obra_social ON clientes(obra_social_id);
CREATE INDEX IF NOT EXISTS idx_clientes_ciudad ON clientes(ciudad_id);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_items_venta ON ventas_items(venta_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_activo ON sesiones(activo);

-- ============================================
-- 5. INSERTAR DATOS INICIALES
-- ============================================

-- Insertar roles
INSERT INTO roles (rol, descripcion) VALUES
    ('Administrador', 'Acceso completo al sistema'),
    ('Vendedor', 'Puede realizar ventas y gestionar clientes'),
    ('Farmacéutico', 'Puede gestionar productos y recetas'),
    ('Supervisor', 'Puede supervisar operaciones y generar reportes')
ON CONFLICT (rol) DO NOTHING;

-- Insertar categorías de productos
INSERT INTO categorias (categoria, descripcion) VALUES
    ('Medicamentos', 'Medicamentos de venta libre y con receta'),
    ('Higiene Personal', 'Productos de higiene y cuidado personal'),
    ('Suplementos', 'Vitaminas y suplementos alimentarios'),
    ('Cosméticos', 'Productos de belleza y cosmética'),
    ('Accesorios', 'Accesorios médicos y de salud'),
    ('Otros', 'Otros productos')
ON CONFLICT (categoria) DO NOTHING;

-- Insertar ciudades comunes de Argentina
INSERT INTO ciudades (ciudad, provincia) VALUES
    ('Buenos Aires', 'Buenos Aires'),
    ('Córdoba', 'Córdoba'),
    ('Rosario', 'Santa Fe'),
    ('Mendoza', 'Mendoza'),
    ('La Plata', 'Buenos Aires'),
    ('Tucumán', 'Tucumán'),
    ('Mar del Plata', 'Buenos Aires'),
    ('Salta', 'Salta'),
    ('Santa Fe', 'Santa Fe'),
    ('San Juan', 'San Juan')
ON CONFLICT (ciudad) DO NOTHING;

-- Insertar obras sociales comunes
INSERT INTO obras_sociales (obra_social, plan, descuento, codigo) VALUES
    ('OSDE', '210', 20.00, 'OSDE210'),
    ('Swiss Medical', 'Classic', 15.00, 'SM001'),
    ('Medifé', 'Plata', 10.00, 'MF001'),
    ('Obra Social OSPEDYC', 'Base', 12.00, 'OSP001'),
    ('Particular', 'N/A', 0.00, 'PART')
ON CONFLICT DO NOTHING;

-- Crear usuario administrador por defecto
-- NOTA: La contraseña debe ser hasheada en el backend
-- Por defecto usaremos 'admin123' que debe ser hasheado antes de insertar
-- En un entorno real, esto debe hacerse desde el backend
INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id) 
SELECT 
    'Admin',
    'Sistema',
    'admin@farmagest.com',
    -- Esta contraseña debe ser hasheada. Ejemplo: 'admin123' hasheado con bcrypt
    -- Por ahora usamos un hash temporal. Debe ser actualizado desde el backend.
    '$2b$10$rQZ8X8K8X8K8X8K8X8K8Xu8K8X8K8X8K8X8K8X8K8X8K8X8K8X8K', -- Cambiar esto por el hash real
    (SELECT rol_id FROM roles WHERE rol = 'Administrador' LIMIT 1)
ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- 6. CREAR FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obras_sociales_updated_at BEFORE UPDATE ON obras_sociales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ciudades_updated_at BEFORE UPDATE ON ciudades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. CONFIGURAR PERMISOS
-- ============================================

-- Comentarios en las tablas
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE clientes IS 'Tabla de clientes de la farmacia';
COMMENT ON TABLE productos IS 'Tabla de productos disponibles';
COMMENT ON TABLE ventas IS 'Tabla de ventas realizadas';
COMMENT ON TABLE sesiones IS 'Tabla de sesiones de usuario';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    'Tablas creadas:' as mensaje,
    COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';

-- Mostrar lista de tablas
SELECT 
    table_name as "Tabla",
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = t.table_name) as "Columnas"
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;








