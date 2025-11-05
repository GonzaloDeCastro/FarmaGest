# 🚀 Guía Rápida: Desplegar Backend en Railway

## 📋 Resumen Ejecutivo

Esta guía te ayudará a desplegar el backend de FarmaGest en Railway para que la aplicación en Vercel pueda conectarse a él.

**Tiempo estimado:** 15-20 minutos  
**Costo:** Gratis (Railway tiene $5 gratis al mes)

---

## 🎯 Pasos Rápidos

### 1️⃣ Crear Cuenta y Proyecto en Railway

1. Ve a https://railway.app/
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu cuenta de GitHub si es necesario
5. Busca y selecciona: **`GonzaloDeCastro/FarmaGest`**
6. Railway creará automáticamente un servicio

### 2️⃣ Configurar el Servicio Backend

1. En Railway, verás tu proyecto recién creado
2. Haz clic en el servicio (probablemente se llame "FarmaGest")
3. Ve a **"Settings"** → **"Root Directory"**
4. Cambia a: **`backend`**
5. Guarda los cambios

### 3️⃣ Agregar Base de Datos PostgreSQL

1. En tu proyecto Railway, haz clic en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente una base de datos PostgreSQL
4. **GUARDA LAS CREDENCIALES** (las necesitarás más adelante)

### 4️⃣ Configurar Variables de Entorno

En tu servicio backend, ve a **"Variables"** y agrega:

```bash
NODE_ENV=production
PORT=5000

# Base de datos - Usa las variables de referencia de Railway
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# CORS - IMPORTANTE: Incluir Vercel
CORS_ORIGIN=http://localhost:3000,https://farma-gest.vercel.app

# JWT Secret
JWT_SECRET=clave_secreta_super_segura_123456789
JWT_EXPIRES_IN=24h
```

**Nota:** Las variables `${{Postgres.*}}` son referencias automáticas de Railway. Si no funcionan, usa las credenciales manuales que Railway te dio.

### 5️⃣ Configurar Build y Start Commands

En **"Settings"** → **"Deploy"**:

- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`

### 6️⃣ Esperar el Despliegue

Railway comenzará a desplegar automáticamente. Espera 2-3 minutos.

### 7️⃣ Obtener URL del Backend

1. Una vez desplegado, Railway te dará una URL
2. Haz clic en **"Settings"** → **"Domains"**
3. Railway generará una URL como: `https://tu-backend-production.up.railway.app`
4. **COPIA ESTA URL** - la necesitarás para Vercel

### 8️⃣ Migrar la Base de Datos

**Opción A: Usando Railway CLI (Recomendado)**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar a tu proyecto
railway link

# Conectar a PostgreSQL
railway connect postgres

# En la terminal de PostgreSQL que se abra, ejecuta:
\i crear-todo-farmagest.sql
```

**Opción B: Usando pgAdmin o cualquier cliente PostgreSQL**

1. Usa las credenciales que Railway te dio
2. Conéctate a la base de datos
3. Ejecuta el contenido de `crear-todo-farmagest.sql`

**Opción C: Usando el script de migración**

```bash
# En Railway, ve a tu servicio backend
# En "Settings" → "Variables", agrega temporalmente:
RAILWAY_ENV=true

# Luego ejecuta en Railway CLI:
railway run node backend/scripts/migrate.js
```

### 9️⃣ Configurar Usuarios Iniciales

Después de migrar la base de datos, ejecuta:

```bash
railway run node backend/scripts/setupUsers.js
```

O ejecuta manualmente las queries SQL desde `setupUsers.js`.

### 🔟 Verificar que Funciona

1. Ve a: `https://tu-backend-url.railway.app/health`
2. Deberías ver: `{"status":"OK","database":"connected"}`

### 1️⃣1️⃣ Configurar Vercel

1. Ve a tu proyecto en Vercel Dashboard: https://vercel.com/
2. Selecciona tu proyecto **FarmaGest**
3. Ve a **"Settings"** → **"Environment Variables"**
4. Haz clic en **"Add New"**
5. Agrega:
   - **Key:** `REACT_APP_APIBACKEND`
   - **Value:** `https://tu-backend-url.railway.app/api`
   - **Environment:** Production, Preview, Development (selecciona todos)
6. Haz clic en **"Save"**
7. Ve a **"Deployments"** → Haz clic en los 3 puntos → **"Redeploy"**

### 1️⃣2️⃣ Probar la Conexión

1. Ve a https://farma-gest.vercel.app/
2. Intenta hacer login con:
   - Email: `admin@farmagest.com`
   - Contraseña: `admin123`
3. Si funciona, ¡estás listo! 🎉

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Verifica que Root Directory esté en `backend`
- Verifica que `package.json` esté en `backend/`

### Error de conexión a base de datos
- Verifica que las variables de entorno estén correctas
- Usa las variables de referencia: `${{Postgres.PGHOST}}` etc.
- Verifica que la base de datos PostgreSQL esté corriendo en Railway

### CORS errors desde Vercel
- Verifica que `CORS_ORIGIN` incluya `https://farma-gest.vercel.app`
- Verifica que la URL del backend en Vercel sea correcta (termina en `/api`)

### Backend no responde
- Revisa los logs en Railway
- Verifica que el puerto sea correcto (5000)
- Verifica que todas las variables de entorno estén configuradas

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que la base de datos esté migrada

---

## ✅ Checklist Final

- [ ] Backend desplegado en Railway
- [ ] Base de datos PostgreSQL creada
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada (tablas creadas)
- [ ] Usuarios iniciales configurados
- [ ] URL del backend obtenida
- [ ] Variable `REACT_APP_APIBACKEND` configurada en Vercel
- [ ] Vercel redeployado
- [ ] Login funcionando desde Vercel

¡Listo! Tu aplicación debería estar funcionando completamente. 🎉

