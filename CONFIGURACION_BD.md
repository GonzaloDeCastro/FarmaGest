# Configuración de Base de Datos FarmaGest

## ✅ Estado: Base de Datos Configurada Correctamente

---

## 📊 Información de la Base de Datos

**Base de Datos:** `farmagest`  
**PostgreSQL:** Versión 18.0  
**Ubicación:** localhost:5432

---

## 👤 Credenciales de Usuario

### Usuario Administrador (PostgreSQL)
```
Usuario: postgres
Contraseña: 123456.a
```

**Uso:** Para administración y tareas de mantenimiento de PostgreSQL

### Usuario de Aplicación (Recomendado para producción)
```
Usuario: farmagest_user
Contraseña: farmagest123
```

**Uso:** Para la conexión desde tu aplicación backend

---

## 🔧 Configuración para tu Aplicación

### Configuración Recomendada (usando usuario específico)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmagest
DB_USER=farmagest_user
DB_PASSWORD=farmagest123
```

### Configuración Alternativa (usando postgres)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmagest
DB_USER=postgres
DB_PASSWORD=123456.a
```

---

## 📋 Estructura de la Base de Datos

### Tablas Creadas (14 tablas)

#### Tablas Principales
- **usuarios** - Usuarios del sistema
- **roles** - Roles de usuario (Administrador, Vendedor, Farmacéutico, Supervisor)
- **clientes** - Clientes de la farmacia
- **ciudades** - Ciudades disponibles
- **obras_sociales** - Obras sociales
- **productos** - Productos disponibles
- **categorias** - Categorías de productos
- **proveedores** - Proveedores
- **ventas** - Ventas realizadas
- **ventas_items** - Items de cada venta
- **sesiones** - Sesiones de usuario

#### Tablas de Auditoría
- **auditoria_productos** - Auditoría de cambios en productos
- **auditoria_clientes** - Auditoría de cambios en clientes
- **auditoria_obras_sociales** - Auditoría de cambios en obras sociales

### Índices Creados: 13 índices para mejorar el rendimiento

### Triggers Creados: 9 triggers para actualizar automáticamente `updated_at`

---

## 📦 Datos Iniciales Insertados

### Roles (4)
- Administrador - Acceso completo al sistema
- Vendedor - Puede realizar ventas y gestionar clientes
- Farmacéutico - Puede gestionar productos y recetas
- Supervisor - Puede supervisar operaciones y generar reportes

### Categorías (6)
- Medicamentos
- Higiene Personal
- Suplementos
- Cosméticos
- Accesorios
- Otros

### Ciudades (10)
- Buenos Aires, Córdoba, Rosario, Mendoza, La Plata, Tucumán, Mar del Plata, Salta, Santa Fe, San Juan

### Obras Sociales (5)
- OSDE (Plan 210, 20% descuento)
- Swiss Medical (Plan Classic, 15% descuento)
- Medifé (Plan Plata, 10% descuento)
- Obra Social OSPEDYC (Plan Base, 12% descuento)
- Particular (0% descuento)

### Usuario Administrador por Defecto
- **Email:** admin@farmagest.com
- **Contraseña:** Debe ser configurada desde el backend (actualmente tiene un hash temporal)
- **Rol:** Administrador

---

## 🔍 Comandos Útiles

### Conectarse a la base de datos
```powershell
# Con usuario específico
psql -U farmagest_user -d farmagest

# Con usuario administrador
psql -U postgres -d farmagest
```

### Ver todas las tablas
```sql
\dt
```

### Ver estructura de una tabla
```sql
\d nombre_tabla
```

### Ver datos de una tabla
```sql
SELECT * FROM roles;
SELECT * FROM categorias;
SELECT * FROM ciudades;
SELECT * FROM obras_sociales;
```

### Contar registros
```sql
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM clientes;
```

---

## 📝 Notas Importantes

1. **Usuario Administrador:** El usuario `admin@farmagest.com` tiene un hash de contraseña temporal. Debes configurar la contraseña real desde el backend de tu aplicación.

2. **Seguridad:** 
   - El usuario `farmagest_user` tiene permisos completos en la base de datos `farmagest`
   - Considera cambiar las contraseñas antes de usar en producción
   - El usuario `postgres` tiene privilegios de superusuario

3. **Backup:** Se recomienda hacer backups regulares:
   ```powershell
   pg_dump -U postgres -d farmagest > backup_farmagest_$(Get-Date -Format 'yyyyMMdd').sql
   ```

4. **Restaurar Backup:**
   ```powershell
   psql -U postgres -d farmagest < backup_farmagest_YYYYMMDD.sql
   ```

---

## ✅ Verificación de Instalación

Para verificar que todo está funcionando:

```powershell
# Verificar conexión con usuario de aplicación
$env:PGPASSWORD='farmagest123'
psql -U farmagest_user -d farmagest -c "SELECT COUNT(*) FROM roles;"

# Verificar datos iniciales
psql -U farmagest_user -d farmagest -c "SELECT * FROM roles;"
psql -U farmagest_user -d farmagest -c "SELECT categoria FROM categorias;"
```

---

## 📚 Archivos de Scripts Disponibles

- `crear-todo-farmagest.sql` - Script SQL completo para recrear la base de datos
- `crear-base-datos-solo.sql` - Script para crear solo la base de datos
- `crear-esquema-farmagest.sql` - Script para crear el esquema completo
- `crear-usuario-simple.ps1` - Script para crear usuario de aplicación
- `configurar-postgres.ps1` - Script para configurar PostgreSQL en PATH

---

**Fecha de Creación:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  
**PostgreSQL Version:** 18.0  
**Estado:** ✅ Configurado y Funcionando

