# Guía de Creación de Base de Datos FarmaGest

Esta guía explica cómo crear la base de datos PostgreSQL para el sistema FarmaGest.

## 📋 Requisitos Previos

1. **PostgreSQL instalado** (versión 12 o superior)
2. **Servicio de PostgreSQL corriendo**
3. **Credenciales de superusuario** (usuario `postgres` y su contraseña)

## 🚀 Pasos para Crear la Base de Datos

### Opción 1: Usar el Script PowerShell (Recomendado)

1. **Abrir PowerShell como Administrador**
   - Click derecho en PowerShell
   - Seleccionar "Ejecutar como administrador"

2. **Navegar al directorio del proyecto**
   ```powershell
   cd "C:\Users\Administrator\Desktop\Farma GEST\FarmaGest"
   ```

3. **Ejecutar el script de creación**
   ```powershell
   .\crear-base-datos.ps1
   ```

4. **Seguir las instrucciones en pantalla**
   - El script detectará automáticamente tu instalación de PostgreSQL
   - Te pedirá las credenciales de PostgreSQL (usuario y contraseña)
   - Si la base de datos ya existe, te preguntará si deseas eliminarla y recrearla

### Opción 2: Ejecutar SQL Manualmente

1. **Conectar a PostgreSQL**
   ```powershell
   psql -U postgres
   ```

2. **Ejecutar el script SQL**
   ```sql
   \i crear-base-datos.sql
   ```

   O desde PowerShell:
   ```powershell
   psql -U postgres -f crear-base-datos.sql
   ```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **usuarios** - Usuarios del sistema
- **roles** - Roles de usuario (Administrador, Vendedor, etc.)
- **clientes** - Clientes de la farmacia
- **ciudades** - Ciudades disponibles
- **obras_sociales** - Obras sociales
- **productos** - Productos disponibles
- **categorias** - Categorías de productos
- **proveedores** - Proveedores
- **ventas** - Ventas realizadas
- **ventas_items** - Items de cada venta
- **sesiones** - Sesiones de usuario
- **auditoria_productos** - Auditoría de cambios en productos
- **auditoria_clientes** - Auditoría de cambios en clientes
- **auditoria_obras_sociales** - Auditoría de cambios en obras sociales

### Datos Iniciales

El script inserta automáticamente:

- **4 Roles**: Administrador, Vendedor, Farmacéutico, Supervisor
- **6 Categorías**: Medicamentos, Higiene Personal, Suplementos, Cosméticos, Accesorios, Otros
- **10 Ciudades**: Buenos Aires, Córdoba, Rosario, Mendoza, etc.
- **5 Obras Sociales**: OSDE, Swiss Medical, Medifé, OSPEDYC, Particular

## 👤 Crear Usuario Específico de Base de Datos (Opcional)

Si deseas crear un usuario específico para la aplicación (recomendado para producción):

1. **Ejecutar el script de creación de usuario**
   ```powershell
   .\crear-usuario-db.ps1
   ```

2. **Seguir las instrucciones**
   - Ingresar credenciales de PostgreSQL
   - Ingresar nombre y contraseña para el nuevo usuario
   - El script otorgará automáticamente los privilegios necesarios

## ⚠️ Importante

### Usuario Administrador por Defecto

El script crea un usuario administrador por defecto:
- **Email**: `admin@farmagest.com`
- **Contraseña**: **NO configurada** (debe ser hasheada desde el backend)

**IMPORTANTE**: Debes configurar la contraseña hasheada desde el backend de tu aplicación antes de poder usar este usuario.

### Configuración del Backend

Una vez creada la base de datos, configura tu backend con:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmagest
DB_USER=postgres  # o el usuario que hayas creado
DB_PASSWORD=tu_contraseña
```

## 🔍 Verificar la Instalación

Para verificar que todo se creó correctamente:

```powershell
# Conectar a la base de datos
psql -U postgres -d farmagest

# Ver todas las tablas
\dt

# Ver estructura de una tabla
\d usuarios

# Contar registros en una tabla
SELECT COUNT(*) FROM roles;
SELECT COUNT(*) FROM categorias;
SELECT COUNT(*) FROM ciudades;
SELECT COUNT(*) FROM obras_sociales;

# Salir
\q
```

## 🛠️ Solución de Problemas

### Error: "No se pudo conectar a PostgreSQL"
- Verifica que el servicio de PostgreSQL esté corriendo
- Verifica que las credenciales sean correctas
- Verifica que el puerto 5432 esté disponible

### Error: "La base de datos ya existe"
- El script te preguntará si deseas eliminarla y recrearla
- Si no deseas eliminarla, puedes continuar usando la base de datos existente

### Error: "Permiso denegado"
- Asegúrate de ejecutar PowerShell como Administrador
- Verifica que tengas permisos de superusuario en PostgreSQL

## 📝 Scripts Disponibles

1. **crear-base-datos.sql** - Script SQL con todas las definiciones de tablas y datos iniciales
2. **crear-base-datos.ps1** - Script PowerShell para ejecutar la creación automáticamente
3. **crear-usuario-db.ps1** - Script PowerShell para crear un usuario específico de base de datos
4. **configurar-postgres.ps1** - Script para configurar PostgreSQL en el PATH (ya ejecutado)

## 🔄 Actualizar la Base de Datos

Si necesitas actualizar la estructura de la base de datos en el futuro:

1. **Hacer backup primero**
   ```powershell
   pg_dump -U postgres -d farmagest > backup_farmagest_$(Get-Date -Format 'yyyyMMdd').sql
   ```

2. **Modificar el script SQL** según sea necesario

3. **Ejecutar el script actualizado** (o crear migraciones)

## 📚 Recursos Adicionales

- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Guía de Instalación de PostgreSQL](INSTALACION_POSTGRESQL.md)
- [Solución de Problemas de Conexión](SOLUCION_CONEXION_POSTGRES.md)

---

**Nota**: Esta base de datos reemplaza MySQL Workbench que generaba problemas. Todas las tablas y relaciones están configuradas para PostgreSQL.







