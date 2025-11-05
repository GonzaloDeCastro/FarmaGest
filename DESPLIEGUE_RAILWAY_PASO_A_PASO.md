# 🚀 Guía Paso a Paso: Desplegar en Railway

## 📋 Paso 1: Crear Cuenta en Railway

1. Abre tu navegador y ve a: **https://railway.app/**
2. Haz clic en **"Start a New Project"** o **"Login"** si ya tienes cuenta
3. Si es tu primera vez:
   - Selecciona **"Login with GitHub"** (recomendado)
   - Autoriza Railway para acceder a tu GitHub
   - Esto permitirá despliegue automático desde GitHub

---

## 📋 Paso 2: Crear Nuevo Proyecto

1. En el dashboard de Railway, haz clic en **"+ New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si no has conectado GitHub:
   - Haz clic en **"Configure GitHub App"**
   - Selecciona tu repositorio: **`GonzaloDeCastro/FarmaGest`**
   - Haz clic en **"Install"**
4. Una vez conectado, busca y selecciona: **`GonzaloDeCastro/FarmaGest`**
5. Railway comenzará a detectar automáticamente el proyecto

---

## 📋 Paso 3: Configurar el Servicio Backend

Railway creará un servicio automáticamente. Ahora necesitas configurarlo:

1. Haz clic en el servicio que Railway creó (probablemente se llama "FarmaGest")
2. Ve a la pestaña **"Settings"**
3. Busca la sección **"Root Directory"**
4. Cambia de `/` (raíz) a: **`backend`**
5. Haz clic en **"Save"**
6. Railway comenzará a redeployar automáticamente

**¿Por qué?** Porque tu código del backend está en la carpeta `backend/`, no en la raíz.

---

## 📋 Paso 4: Agregar Base de Datos PostgreSQL

1. En tu proyecto Railway, haz clic en **"+ New"** (arriba a la derecha)
2. Selecciona **"Database"**
3. Selecciona **"Add PostgreSQL"**
4. Railway creará automáticamente una base de datos PostgreSQL
5. **GUARDA ESTA INFORMACIÓN** (la necesitarás más adelante):
   - Haz clic en la base de datos PostgreSQL que se creó
   - Ve a la pestaña **"Variables"**
   - Anota o copia las credenciales:
     - `PGHOST`
     - `PGPORT`
     - `PGDATABASE`
     - `PGUSER`
     - `PGPASSWORD`

---

## 📋 Paso 5: Conectar Backend con Base de Datos

1. Vuelve a tu servicio backend (el que configuraste en el Paso 3)
2. Ve a la pestaña **"Variables"**
3. Haz clic en **"+ New Variable"** para cada variable

**Variables a agregar:**

```
NODE_ENV = production
```

```
PORT = 5000
```

```
DB_HOST = ${{Postgres.PGHOST}}
```

```
DB_PORT = ${{Postgres.PGPORT}}
```

```
DB_NAME = ${{Postgres.PGDATABASE}}
```

```
DB_USER = ${{Postgres.PGUSER}}
```

```
DB_PASSWORD = ${{Postgres.PGPASSWORD}}
```

```
CORS_ORIGIN = http://localhost:3000,https://farma-gest.vercel.app
```

```
JWT_SECRET = clave_secreta_super_segura_cambiar_en_produccion_123456789
```

```
JWT_EXPIRES_IN = 24h
```

**Nota:** Las variables `${{Postgres.*}}` son referencias automáticas. Railway las reemplazará automáticamente con los valores de tu base de datos PostgreSQL.

**Si las variables de referencia no funcionan:**
- Usa las credenciales manuales que copiaste en el Paso 4
- Reemplaza `${{Postgres.PGHOST}}` con el valor real de `PGHOST`, etc.

---

## 📋 Paso 6: Verificar Configuración de Build

1. En tu servicio backend, ve a **"Settings"** → **"Deploy"**
2. Verifica que esté configurado:
   - **Build Command:** `cd backend && npm install` (o simplemente `npm install`)
   - **Start Command:** `cd backend && npm start` (o simplemente `npm start`)

**Nota:** Como ya configuraste Root Directory en `backend`, puedes usar solo `npm install` y `npm start`.

---

## 📋 Paso 7: Esperar el Despliegue

1. Railway comenzará a desplegar automáticamente cuando:
   - Cambiaste el Root Directory
   - Agregaste las variables de entorno
2. Ve a la pestaña **"Deployments"** para ver el progreso
3. Espera 2-3 minutos mientras Railway:
   - Instala dependencias (`npm install`)
   - Inicia el servidor (`npm start`)

---

## 📋 Paso 8: Obtener URL del Backend

1. Una vez desplegado, ve a **"Settings"** → **"Domains"**
2. Railway generará automáticamente una URL
3. Haz clic en **"Generate Domain"** si no hay una URL
4. La URL será algo como: `https://tu-backend-production.up.railway.app`
5. **COPIA ESTA URL** - la necesitarás para Vercel

**Verificar que funciona:**
- Abre la URL en tu navegador: `https://tu-backend-url.railway.app/health`
- Deberías ver: `{"status":"OK","database":"connected"}`

---

## 📋 Paso 9: Migrar la Base de Datos

Tienes **3 opciones** para migrar la base de datos:

### Opción A: Usando Railway CLI (Recomendado)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Conectar a tu proyecto
railway link
# Selecciona tu proyecto cuando te pregunte

# 4. Conectar a PostgreSQL
railway connect postgres
# Esto abrirá una terminal de PostgreSQL

# 5. En la terminal de PostgreSQL, ejecuta:
\i crear-todo-farmagest.sql
```

### Opción B: Usando pgAdmin o cliente PostgreSQL

1. Descarga pgAdmin o cualquier cliente PostgreSQL
2. Crea una nueva conexión con las credenciales de Railway:
   - Host: `PGHOST` (de Railway)
   - Port: `PGPORT` (de Railway)
   - Database: `PGDATABASE` (de Railway)
   - Username: `PGUSER` (de Railway)
   - Password: `PGPASSWORD` (de Railway)
3. Conéctate
4. Abre el archivo `crear-todo-farmagest.sql`
5. Ejecuta todo el contenido

### Opción C: Usando el script de migración

```bash
# En Railway CLI
railway run node backend/scripts/migrate.js
```

---

## 📋 Paso 10: Configurar Usuarios Iniciales

Después de migrar la base de datos, ejecuta:

```bash
railway run node backend/scripts/setupUsers.js
```

O ejecuta manualmente las queries SQL desde `setupUsers.js`.

**Esto creará:**
- Usuario admin: `admin@farmagest.com` / `admin123`
- Usuario test: `test@farmagest.com` / `test123`

---

## 📋 Paso 11: Configurar Vercel

1. Ve a tu proyecto en Vercel Dashboard: https://vercel.com/
2. Selecciona tu proyecto **FarmaGest**
3. Ve a **"Settings"** → **"Environment Variables"**
4. Haz clic en **"Add New"**
5. Agrega:
   - **Key:** `REACT_APP_APIBACKEND`
   - **Value:** `https://tu-backend-url.railway.app/api`
     (Reemplaza con la URL real que obtuviste en el Paso 8)
   - **Environment:** Selecciona todos (Production, Preview, Development)
6. Haz clic en **"Save"**
7. Ve a **"Deployments"**
8. Haz clic en los **3 puntos** del último deployment
9. Selecciona **"Redeploy"**

---

## 📋 Paso 12: Verificar que Todo Funciona

1. Espera a que Vercel termine de redeployar
2. Ve a https://farma-gest.vercel.app/
3. Intenta hacer login con:
   - Email: `admin@farmagest.com`
   - Contraseña: `admin123`
4. Si funciona, ¡estás listo! 🎉

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Verifica que Root Directory esté en `backend`
- Verifica que `package.json` esté en `backend/`

### Error de conexión a base de datos
- Verifica que todas las variables de entorno estén configuradas
- Verifica que las variables `${{Postgres.*}}` estén correctas
- Si no funcionan, usa las credenciales manuales

### Error: "Database connection failed"
- Verifica que la base de datos PostgreSQL esté corriendo
- Verifica las credenciales en Variables
- Intenta reconectar la base de datos

### CORS errors desde Vercel
- Verifica que `CORS_ORIGIN` incluya `https://farma-gest.vercel.app`
- Verifica que la URL del backend en Vercel sea correcta (termina en `/api`)

### Backend no responde
- Revisa los logs en Railway (pestaña "Deployments" → "View Logs")
- Verifica que el puerto sea 5000
- Verifica que todas las variables estén configuradas

---

## ✅ Checklist Final

- [ ] Cuenta creada en Railway
- [ ] Proyecto conectado a GitHub
- [ ] Servicio configurado con Root Directory: `backend`
- [ ] Base de datos PostgreSQL agregada
- [ ] Variables de entorno configuradas
- [ ] Backend desplegado y funcionando
- [ ] URL del backend obtenida
- [ ] Base de datos migrada (tablas creadas)
- [ ] Usuarios iniciales configurados
- [ ] Variable `REACT_APP_APIBACKEND` configurada en Vercel
- [ ] Vercel redeployado
- [ ] Login funcionando desde Vercel

---

## 🎯 Próximos Pasos Después del Despliegue

1. **Verificar logs:** Revisa los logs en Railway para asegurarte de que todo funciona
2. **Monitorear:** Usa Railway Dashboard para monitorear el uso
3. **Backups:** Configura backups automáticos de la base de datos
4. **Seguridad:** Cambia `JWT_SECRET` por uno más seguro en producción
5. **Dominio personalizado:** Puedes agregar un dominio personalizado en Railway

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas en algún paso:
1. Revisa los logs en Railway
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que la base de datos esté migrada

¡Buena suerte con el despliegue! 🚀

