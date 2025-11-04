# Guía de Instalación y Configuración de PostgreSQL

## Problema Detectado
PostgreSQL está instalado (versión 13 y 18) pero el comando `psql` no está disponible en la línea de comandos porque no está en el PATH del sistema.

## Solución: Agregar PostgreSQL al PATH

### Opción 1: Usando PowerShell (Recomendado)

1. **Abrir PowerShell como Administrador**:
   - Click derecho en el botón Inicio
   - Seleccionar "Windows PowerShell (Administrador)" o "Terminal (Administrador)"

2. **Agregar PostgreSQL 13 al PATH del sistema** (o usar la versión 18 si prefieres):
   ```powershell
   $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
   $postgresPath = "C:\Program Files\PostgreSQL\13\bin"
   
   if ($currentPath -notlike "*$postgresPath*") {
       [Environment]::SetEnvironmentVariable("Path", "$currentPath;$postgresPath", "Machine")
       Write-Host "PostgreSQL agregado al PATH correctamente"
   } else {
       Write-Host "PostgreSQL ya está en el PATH"
   }
   ```

3. **O para PostgreSQL 18**:
   ```powershell
   $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
   $postgresPath = "C:\Program Files\PostgreSQL\18\bin"
   
   if ($currentPath -notlike "*$postgresPath*") {
       [Environment]::SetEnvironmentVariable("Path", "$currentPath;$postgresPath", "Machine")
       Write-Host "PostgreSQL agregado al PATH correctamente"
   } else {
       Write-Host "PostgreSQL ya está en el PATH"
   }
   ```

4. **Cerrar y volver a abrir PowerShell** para que los cambios surtan efecto.

5. **Verificar la instalación**:
   ```powershell
   psql --version
   ```

### Opción 2: Configuración Manual del PATH

1. **Abrir las Variables de Entorno**:
   - Presiona `Win + R`
   - Escribe `sysdm.cpl` y presiona Enter
   - Ve a la pestaña "Opciones avanzadas"
   - Click en "Variables de entorno"

2. **Editar la variable PATH del sistema**:
   - En "Variables del sistema", busca `Path`
   - Click en "Editar"
   - Click en "Nuevo"
   - Agrega: `C:\Program Files\PostgreSQL\13\bin` (o `C:\Program Files\PostgreSQL\18\bin`)
   - Click en "Aceptar" en todas las ventanas

3. **Cerrar y volver a abrir PowerShell/Terminal**

## Verificar la Conexión a PostgreSQL

Después de agregar PostgreSQL al PATH, puedes verificar la conexión:

```powershell
# Conectar a PostgreSQL (usuario por defecto: postgres)
psql -U postgres

# O especificar la base de datos
psql -U postgres -d postgres
```

**Nota**: Te pedirá la contraseña que configuraste durante la instalación.

## Comandos Útiles de PostgreSQL

```sql
-- Listar todas las bases de datos
\l

-- Crear una nueva base de datos
CREATE DATABASE farmagest;

-- Conectarse a una base de datos específica
\c farmagest

-- Listar todas las tablas
\dt

-- Salir de psql
\q
```

## Si Necesitas Reinstalar PostgreSQL

Si prefieres reinstalar PostgreSQL desde cero:

### 1. Descargar PostgreSQL
- Ve a: https://www.postgresql.org/download/windows/
- Descarga el instalador desde EnterpriseDB

### 2. Durante la Instalación
- **Puerto**: Deja el puerto por defecto (5432) o elige otro si está ocupado
- **Superusuario**: Configura una contraseña para el usuario `postgres` (¡guárdala en un lugar seguro!)
- **Opcional**: Marca la casilla "Stack Builder" si necesitas herramientas adicionales

### 3. Verificar el Servicio
- Abre "Servicios" (Win + R, escribe `services.msc`)
- Busca "postgresql-x64-13" o "postgresql-x64-18"
- Debe estar en estado "En ejecución"

## Configuración para el Backend de FarmaGest

Una vez que PostgreSQL esté funcionando, necesitarás configurar la conexión en tu backend. Normalmente necesitarás:

```env
# Ejemplo de variables de entorno (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmagest
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
```

## Solución de Problemas Comunes

### Error: "psql: error: connection to server at 'localhost' failed"
- Verifica que el servicio de PostgreSQL esté corriendo
- Verifica el puerto (por defecto es 5432)
- Verifica el firewall de Windows

### Error: "password authentication failed"
- Verifica que estés usando la contraseña correcta del usuario postgres
- Puedes restablecer la contraseña desde pgAdmin o reinstalando

### El servicio no inicia
- Verifica los logs en: `C:\Program Files\PostgreSQL\13\data\log\` (o la versión que tengas)
- Asegúrate de que el puerto 5432 no esté siendo usado por otra aplicación

## Recursos Adicionales
- [Documentación oficial de PostgreSQL](https://www.postgresql.org/docs/)
- [pgAdmin](https://www.pgadmin.org/) - Herramienta gráfica para administrar PostgreSQL
