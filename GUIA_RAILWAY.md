# Railway Deployment Guide - FarmaGest Backend

## 🚀 Pasos para Desplegar en Railway

### Paso 1: Crear Cuenta en Railway
1. Ve a https://railway.app/
2. Haz clic en "Start a New Project"
3. Conecta con GitHub (recomendado) o usa tu email

### Paso 2: Crear Nuevo Proyecto
1. Haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona tu repositorio: `GonzaloDeCastro/FarmaGest`
4. Railway detectará automáticamente que es un proyecto Node.js

### Paso 3: Configurar el Servicio
1. Railway creará un servicio automáticamente
2. Necesitas configurarlo para que apunte a la carpeta `backend/`
3. En "Settings" → "Root Directory", cambia a: `backend`

### Paso 4: Agregar Base de Datos PostgreSQL
1. En tu proyecto Railway, haz clic en "+ New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Railway creará automáticamente una base de datos PostgreSQL
4. **IMPORTANTE**: Anota las credenciales que te da Railway

### Paso 5: Configurar Variables de Entorno
En el servicio de tu backend, ve a "Variables" y agrega:

```
NODE_ENV=production
PORT=5000

# Base de datos (Railway te da estas variables automáticamente)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# O si prefieres escribirlas manualmente:
# DB_HOST=containers-us-west-xxx.railway.app
# DB_PORT=5432
# DB_NAME=railway
# DB_USER=postgres
# DB_PASSWORD=tu_password
# (Usa las credenciales que Railway te dio)

# CORS
CORS_ORIGIN=http://localhost:3000,https://farma-gest.vercel.app

# JWT (opcional, pero recomendado)
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRES_IN=24h
```

### Paso 6: Configurar Build y Start Commands
En "Settings" → "Build Command":
```
npm install
```

En "Settings" → "Start Command":
```
npm start
```

### Paso 7: Migrar Base de Datos
Una vez que Railway esté corriendo:

1. **Obtén las credenciales de PostgreSQL de Railway**
2. **Ejecuta el script SQL de creación:**
   - Opción A: Usar Railway CLI para conectarte
   - Opción B: Usar pgAdmin o cualquier cliente PostgreSQL
   - Conecta con las credenciales de Railway
   - Ejecuta el contenido de `crear-todo-farmagest.sql`

O puedes crear un script de migración que se ejecute automáticamente.

### Paso 8: Obtener URL del Backend
1. Una vez desplegado, Railway te dará una URL
2. Será algo como: `https://tu-backend-production.up.railway.app`
3. **Copia esta URL** - la necesitarás para Vercel

### Paso 9: Verificar que Funciona
1. Ve a: `https://tu-backend-url.railway.app/health`
2. Deberías ver: `{"status":"OK","database":"connected"}`

### Paso 10: Configurar Vercel
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:
   ```
   REACT_APP_APIBACKEND=https://tu-backend-url.railway.app/api
   ```
4. Haz clic en "Redeploy" para aplicar los cambios

## 🔧 Comandos Útiles de Railway CLI

Si quieres usar Railway CLI:

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Conectar a tu proyecto
railway link

# Desplegar
railway up

# Ver logs
railway logs

# Conectar a PostgreSQL
railway connect postgres
```

## 📋 Checklist de Despliegue

- [ ] Cuenta creada en Railway
- [ ] Proyecto conectado a GitHub
- [ ] Servicio configurado con Root Directory: `backend`
- [ ] Base de datos PostgreSQL agregada
- [ ] Variables de entorno configuradas
- [ ] Build y Start commands configurados
- [ ] Backend desplegado y funcionando
- [ ] Base de datos migrada (ejecutar crear-todo-farmagest.sql)
- [ ] URL del backend obtenida
- [ ] Variable REACT_APP_APIBACKEND configurada en Vercel
- [ ] Vercel redeployado
- [ ] Conexión verificada desde Vercel

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Verifica que Root Directory esté en `backend`
- Verifica que package.json esté en la carpeta backend

### Error de conexión a base de datos
- Verifica que las variables de entorno estén correctas
- Usa las variables de Railway: `${{Postgres.PGHOST}}` etc.

### CORS errors
- Verifica que `CORS_ORIGIN` incluya `https://farma-gest.vercel.app`
- Verifica que la URL del backend en Vercel sea correcta

## 📝 Notas Importantes

1. **Railway tiene un plan gratuito** que incluye:
   - $5 gratis al mes
   - PostgreSQL incluido
   - Despliegue automático desde GitHub

2. **Después de desplegar**, necesitarás:
   - Migrar la base de datos (ejecutar scripts SQL)
   - Configurar usuarios iniciales (ejecutar setupUsers.js o manualmente)

3. **Para producción**, considera:
   - Usar un JWT_SECRET más seguro
   - Configurar HTTPS
   - Configurar backups de la base de datos
   - Monitorear logs y errores

