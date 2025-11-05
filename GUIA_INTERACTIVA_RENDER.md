# 🚀 Guía Interactiva: Desplegar en Render

## 📋 PASO 1: Crear Cuenta en Render

1. Abre tu navegador y ve a: **https://render.com/**
2. Haz clic en **"Get Started for Free"** (botón grande en el centro)
3. Selecciona **"Sign up with GitHub"** (recomendado - botón azul)
4. Autoriza Render para acceder a tu GitHub
5. Confirma tu email si te lo piden

**✅ Cuando termines este paso, avísame y continuamos con el siguiente.**

---

## 📋 PASO 2: Crear Base de Datos PostgreSQL

Una vez que estés en el dashboard de Render:

1. Haz clic en **"+ New +"** (arriba a la izquierda)
2. Selecciona **"PostgreSQL"**
3. Llena el formulario:
   - **Name:** `farmagest-db`
   - **Database:** `farmagest`
   - **User:** `farmagest_user`
   - **Region:** Elige la más cercana (ej: `Oregon (US West)` o `Frankfurt (EU Central)`)
   - **PostgreSQL Version:** 18 (o la más reciente disponible)
   - **Plan:** Selecciona **"Free"** (750 hours/month)
4. Haz clic en **"Create Database"**
5. Espera 1-2 minutos mientras Render crea la base de datos
6. Cuando esté lista, haz clic en la base de datos que creaste
7. Ve a la pestaña **"Info"**
8. **IMPORTANTE:** Copia y guarda la **"Internal Database URL"**
   - Se ve así: `postgresql://user:password@host:5432/database`
   - La necesitarás en el siguiente paso

**✅ Cuando tengas la Internal Database URL copiada, avísame y continuamos.**

---

## 📋 PASO 3: Crear Servicio Web (Backend)

1. En el dashboard de Render, haz clic en **"+ New +"** otra vez
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub:
   - Si no está conectado, haz clic en **"Connect account"** o **"Configure account"**
   - Selecciona **`GonzaloDeCastro/FarmaGest`**
   - Haz clic en **"Connect"**
4. Configura el servicio:
   - **Name:** `farmagest-backend`
   - **Environment:** `Node` (debería detectarse automáticamente)
   - **Region:** La misma que elegiste para la BD
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ IMPORTANTE
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Selecciona **"Free"** (750 hours/month)
5. Haz clic en **"Create Web Service"**

**✅ Cuando Render comience a desplegar, avísame y continuamos con las variables de entorno.**

---

## 📋 PASO 4: Configurar Variables de Entorno

En tu servicio web que acabas de crear:

1. Ve a la pestaña **"Environment"** (en el menú lateral)
2. Verás una sección "Environment Variables"
3. Haz clic en **"Add Environment Variable"** para cada una:

**Variable 1:**
- Key: `NODE_ENV`
- Value: `production`
- Click "Save"

**Variable 2:**
- Key: `PORT`
- Value: `10000`
- Click "Save"

**Variable 3:**
- Key: `DATABASE_URL`
- Value: (Pega aquí la Internal Database URL que copiaste en el Paso 2)
- Click "Save"

**Variable 4:**
- Key: `CORS_ORIGIN`
- Value: `http://localhost:3000,https://farma-gest.vercel.app`
- Click "Save"

**Variable 5:**
- Key: `JWT_SECRET`
- Value: `clave_secreta_super_segura_cambiar_en_produccion_123456789`
- Click "Save"

**Variable 6:**
- Key: `JWT_EXPIRES_IN`
- Value: `24h`
- Click "Save"

**✅ Cuando hayas agregado todas las variables, avísame y continuamos.**

---

## 📋 PASO 5: Esperar Despliegue y Obtener URL

1. Render comenzará a desplegar automáticamente cuando agregues las variables
2. Ve a la pestaña **"Events"** para ver el progreso
3. Espera 3-5 minutos mientras Render:
   - Instala dependencias (`npm install`)
   - Inicia el servidor (`npm start`)
4. Cuando veas "Your service is live", el despliegue está completo
5. Render te mostrará la URL automáticamente (arriba del dashboard)
   - Será algo como: `https://farmagest-backend.onrender.com`
6. **COPIA ESTA URL** - la necesitarás para Vercel

**Verificar que funciona:**
- Abre la URL + `/health` en tu navegador
- Ejemplo: `https://farmagest-backend.onrender.com/health`
- Deberías ver: `{"status":"OK","database":"connected"}`

**✅ Cuando tengas la URL y verifiques que funciona, avísame y continuamos con la migración de la base de datos.**

---

## 📋 PASO 6: Migrar la Base de Datos

Tienes 2 opciones fáciles:

### Opción A: Usando Render Shell (Recomendado)

1. En tu servicio web, ve a la pestaña **"Shell"**
2. Se abrirá una terminal en el navegador
3. Ejecuta:
   ```bash
   psql $DATABASE_URL
   ```
4. Te conectará a PostgreSQL
5. Ahora necesitas ejecutar el script SQL:
   - Opción 1: Copia y pega el contenido de `crear-todo-farmagest.sql`
   - Opción 2: Le podemos ayudar a ejecutarlo paso a paso

### Opción B: Usando pgAdmin (Desde tu PC)

1. Usa la **External Database URL** de Render (en la pestaña Info de tu BD)
2. Conéctate desde pgAdmin con esas credenciales
3. Ejecuta el contenido de `crear-todo-farmagest.sql`

**✅ Cuando termines de migrar la base de datos, avísame y continuamos con configurar usuarios.**

---

## 📋 PASO 7: Configurar Usuarios Iniciales

En Render Shell (donde ejecutaste psql):

Ejecuta estos comandos SQL uno por uno:

```sql
-- Actualizar contraseña del admin
UPDATE usuarios SET contrasena = '$2b$10$TuHashAqui' WHERE correo = 'admin@farmagest.com';
```

O mejor aún, ejecuta el script:
```bash
node backend/scripts/setupUsers.js
```

**✅ Cuando termines, avísame y pasamos a configurar Vercel.**

---

## 📋 PASO 8: Configurar Vercel

1. Ve a https://vercel.com/
2. Selecciona tu proyecto **FarmaGest**
3. Ve a **"Settings"** → **"Environment Variables"**
4. Haz clic en **"Add New"**
5. Agrega:
   - **Key:** `REACT_APP_APIBACKEND`
   - **Value:** `https://tu-backend-url.onrender.com/api`
     (Reemplaza con la URL real que obtuviste en el Paso 5)
   - **Environment:** Selecciona todos (Production, Preview, Development)
6. Haz clic en **"Save"**
7. Ve a **"Deployments"**
8. Haz clic en los **3 puntos** del último deployment
9. Selecciona **"Redeploy"**

**✅ Cuando Vercel termine de redeployar, avísame y verificamos que todo funciona.**

---

## 📋 PASO 9: Verificar que Todo Funciona

1. Ve a https://farma-gest.vercel.app/
2. Intenta hacer login con:
   - Email: `admin@farmagest.com`
   - Contraseña: `admin123`
3. Si funciona, ¡estás listo! 🎉

---

## 🆘 Si Tienes Problemas

En cualquier paso, si encuentras un error:
1. Avísame qué paso estás haciendo
2. Comparte el error que ves
3. Te ayudo a solucionarlo

**¿Estás listo para comenzar con el Paso 1?**

