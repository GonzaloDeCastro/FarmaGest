# Solución: Error de Conexión a PostgreSQL

## Problema
Estás recibiendo este error:
```
psql: error: falló la conexión al servidor en «localhost» (::1), puerto 5432
```

## Causa
Tu instalación de PostgreSQL 13 está configurada para usar el **puerto 5433** en lugar del puerto estándar 5432.

## Solución Rápida: Conectar Especificando el Puerto

Para conectarte a PostgreSQL, usa el puerto 5433:

```powershell
psql -U postgres -p 5433
```

O si quieres ejecutar un comando directamente:
```powershell
psql -U postgres -p 5433 -d postgres -c "SELECT version();"
```

## Solución Permanente: Cambiar PostgreSQL al Puerto 5432

Si prefieres usar el puerto estándar 5432, sigue estos pasos:

### Paso 1: Localizar el archivo de configuración
El archivo `postgresql.conf` normalmente está en:
```
C:\Program Files\PostgreSQL\13\data\postgresql.conf
```

### Paso 2: Editar la configuración
1. Abre el archivo `postgresql.conf` con un editor de texto (como Notepad++ o Visual Studio Code)
2. Busca la línea que dice: `#port = 5432`
3. Cambia el valor a: `port = 5432`
4. Guarda el archivo

### Paso 3: Reiniciar el servicio
En PowerShell como Administrador:
```powershell
Restart-Service postgresql-x64-13
```

O usando servicios de Windows:
1. Presiona `Win + R`
2. Escribe `services.msc` y presiona Enter
3. Busca "postgresql-x64-13"
4. Click derecho → Reiniciar

### Paso 4: Verificar
Después de reiniciar, verifica que esté en el puerto 5432:
```powershell
netstat -ano | findstr :5432
```

Ahora podrás conectarte sin especificar el puerto:
```powershell
psql -U postgres
```

## Nota Importante

Si tienes PostgreSQL 18 instalado y está configurado para usar el puerto 5432, tendrás un conflicto. En ese caso:
- Mantén PostgreSQL 13 en el puerto 5433
- O desinstala/configura PostgreSQL 18 para usar otro puerto

## Verificar Puertos en Uso

Para ver qué puertos están siendo usados por PostgreSQL:
```powershell
netstat -ano | findstr LISTENING | findstr "543"
```

## Conectar desde tu Backend

Cuando configures tu backend de FarmaGest, asegúrate de usar el puerto correcto:

```env
# Si PostgreSQL está en el puerto 5433
DB_HOST=localhost
DB_PORT=5433
DB_NAME=farmagest
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
```

O si cambiaste al puerto 5432:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmagest
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
```













