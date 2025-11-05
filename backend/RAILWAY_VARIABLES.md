# Variables de Entorno para Railway

## Variables Necesarias en Railway

Copia estas variables en Railway → Tu Servicio → Variables:

```
NODE_ENV=production
PORT=5000

# Base de datos - Railway proporciona estas automáticamente si usas su PostgreSQL
# Usa las variables de referencia de Railway:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# O si prefieres escribir las credenciales manualmente:
# DB_HOST=containers-us-west-xxx.railway.app
# DB_PORT=5432
# DB_NAME=railway
# DB_USER=postgres
# DB_PASSWORD=tu_password_aqui

# CORS - IMPORTANTE: Agregar dominio de Vercel
CORS_ORIGIN=http://localhost:3000,https://farma-gest.vercel.app

# JWT Secret (cambiar por uno seguro)
JWT_SECRET=clave_secreta_super_segura_cambiar_en_produccion_123456789
JWT_EXPIRES_IN=24h
```

## Cómo Agregar Variables en Railway

1. Ve a tu proyecto en Railway
2. Haz clic en tu servicio (backend)
3. Ve a la pestaña "Variables"
4. Haz clic en "New Variable"
5. Agrega cada variable una por una
6. Railway guardará automáticamente y redeployará

## Variables de Referencia de Railway

Railway permite usar variables de referencia para conectarte a otros servicios:

- `${{Postgres.PGHOST}}` - Host de PostgreSQL
- `${{Postgres.PGPORT}}` - Puerto de PostgreSQL
- `${{Postgres.PGDATABASE}}` - Nombre de la base de datos
- `${{Postgres.PGUSER}}` - Usuario de PostgreSQL
- `${{Postgres.PGPASSWORD}}` - Contraseña de PostgreSQL

Estas son más seguras porque Railway las gestiona automáticamente.

