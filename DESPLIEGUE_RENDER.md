# 🚀 Guía Completa: Desplegar en Render (Gratis - 6 meses)

## ✅ ¿Por qué Render es Perfecto para tu Proyecto?

**Render Free Tier:**
- ✅ **750 horas/mes gratis** = Servicio corriendo 24/7 TODO el mes
- ✅ **Sin límite de tiempo** si no superas las horas
- ✅ **PostgreSQL incluido gratis**
- ✅ **Perfecto para proyectos de 6 meses** 🎓
- ✅ **Sin tarjeta de crédito requerida**

---

## 📋 Paso 1: Crear Cuenta en Render

1. Ve a **https://render.com/**
2. Haz clic en **"Get Started for Free"**
3. Selecciona **"Sign up with GitHub"** (recomendado)
4. Autoriza Render para acceder a tu GitHub
5. Confirma tu email

---

## 📋 Paso 2: Crear Base de Datos PostgreSQL

1. En el dashboard de Render, haz clic en **"+ New +"**
2. Selecciona **"PostgreSQL"**
3. Configura:
   - **Name:** `farmagest-db`
   - **Database:** `farmagest`
   - **User:** `farmagest_user`
   - **Region:** Elige la más cercana (ej: `Oregon (US West)`)
   - **PostgreSQL Version:** 18 o la más reciente
   - **Plan:** **Free** (750 horas/mes)
4. Haz clic en **"Create Database"**
5. Espera 1-2 minutos mientras Render crea la base de datos
6. **IMPORTANTE:** Guarda las credenciales que Render te muestra:
   - Ve a la pestaña **"Info"** de tu base de datos
   - Anota:
     - **Internal Database URL** (para usar desde Render)
     - **External Database URL** (para usar desde fuera)
     - O las credenciales individuales (Host, Port, Database, User, Password)

---

## 📋 Paso 3: Crear Servicio Web (Backend)

1. En el dashboard, haz clic en **"+ New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio:
   - Si no está conectado, haz clic en **"Configure account"**
   - Selecciona **`GonzaloDeCastro/FarmaGest`**
   - Haz clic en **"Connect"**
4. Configura el servicio:
   - **Name:** `farmagest-backend`
   - **Environment:** `Node`
   - **Region:** La misma que elegiste para la BD
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** (750 horas/mes)
5. Haz clic en **"Create Web Service"**

---

## 📋 Paso 4: Configurar Variables de Entorno

En tu servicio web, ve a la pestaña **"Environment"** y agrega estas variables:

### Variables Básicas:
```
NODE_ENV=production
PORT=10000
```

**Nota:** Render asigna el puerto automáticamente. En plan gratuito suele ser `10000`.

### Variables de Base de Datos:

**Opción A: Usar Internal Database URL (Recomendado)**
```
DATABASE_URL=postgresql://user:password@host:5432/database
```
(Usa la Internal Database URL que Render te dio en el Paso 2)

**Opción B: Usar Variables Individuales**
```
DB_HOST=tu-host-de-render.postgres.render.com
DB_PORT=5432
DB_NAME=farmagest
DB_USER=farmagest_user
DB_PASSWORD=tu_password_de_render
```

### Variables Adicionales:
```
CORS_ORIGIN=http://localhost:3000,https://farma-gest.vercel.app
JWT_SECRET=clave_secreta_super_segura_cambiar_en_produccion_123456789
JWT_EXPIRES_IN=24h
```

**Cómo agregar variables:**
1. En la pestaña "Environment"
2. Haz clic en **"Add Environment Variable"**
3. Agrega cada variable una por una
4. Render guardará automáticamente y redeployará

---

## 📋 Paso 5: Esperar el Despliegue

1. Render comenzará a desplegar automáticamente
2. Ve a la pestaña **"Events"** para ver el progreso
3. Espera 3-5 minutos mientras Render:
   - Instala dependencias (`npm install`)
   - Inicia el servidor (`npm start`)

---

## 📋 Paso 6: Obtener URL del Backend

1. Una vez desplegado, Render te dará una URL automáticamente
2. La URL será algo como: `https://farmagest-backend.onrender.com`
3. **COPIA ESTA URL** - la necesitarás para Vercel

**Verificar que funciona:**
- Abre la URL en tu navegador: `https://tu-backend-url.onrender.com/health`
- Deberías ver: `{"status":"OK","database":"connected"}`

---

## 📋 Paso 7: Migrar la Base de Datos

Tienes **3 opciones**:

### Opción A: Usando Render Shell (Recomendado)

1. En tu servicio web, ve a la pestaña **"Shell"**
2. Se abrirá una terminal en el navegador
3. Conéctate a PostgreSQL:
   ```bash
   psql $DATABASE_URL
   ```
4. En la terminal de PostgreSQL, ejecuta:
   ```sql
   \i crear-todo-farmagest.sql
   ```
   O copia y pega el contenido de `crear-todo-farmagest.sql`

### Opción B: Usando pgAdmin o cliente PostgreSQL

1. Usa las credenciales **External Database URL** de Render
2. Conéctate desde pgAdmin o cualquier cliente PostgreSQL
3. Ejecuta el contenido de `crear-todo-farmagest.sql`

### Opción C: Usando script de migración

1. En Render Shell:
   ```bash
   node backend/scripts/migrate.js
   ```

---

## 📋 Paso 8: Configurar Usuarios Iniciales

Después de migrar la base de datos, ejecuta:

```bash
node backend/scripts/setupUsers.js
```

O ejecuta manualmente las queries SQL desde `setupUsers.js`.

**Esto creará:**
- Usuario admin: `admin@farmagest.com` / `admin123`
- Usuario test: `test@farmagest.com` / `test123`

---

## 📋 Paso 9: Configurar Vercel

1. Ve a tu proyecto en Vercel Dashboard: https://vercel.com/
2. Selecciona tu proyecto **FarmaGest**
3. Ve a **"Settings"** → **"Environment Variables"**
4. Haz clic en **"Add New"**
5. Agrega:
   - **Key:** `REACT_APP_APIBACKEND`
   - **Value:** `https://tu-backend-url.onrender.com/api`
     (Reemplaza con la URL real que obtuviste en el Paso 6)
   - **Environment:** Selecciona todos (Production, Preview, Development)
6. Haz clic en **"Save"**
7. Ve a **"Deployments"**
8. Haz clic en los **3 puntos** del último deployment
9. Selecciona **"Redeploy"**

---

## 📋 Paso 10: Verificar que Todo Funciona

1. Espera a que Vercel termine de redeployar
2. Ve a https://farma-gest.vercel.app/
3. Intenta hacer login con:
   - Email: `admin@farmagest.com`
   - Contraseña: `admin123`
4. Si funciona, ¡estás listo! 🎉

---

## ⚠️ Importante: Limitaciones del Plan Gratuito de Render

### Spinning Down (Pausa Automática)
- Si tu servicio está **inactivo por 15 minutos**, Render lo pausa automáticamente
- La primera petición después de pausar puede tardar **30-60 segundos** (cold start)
- Esto es normal y no afecta tu proyecto para presentación

### Para Evitar Pausas:
1. Configura un **health check** periódico (opcional)
2. O simplemente acepta el cold start (es normal en plan gratuito)

### Base de Datos:
- **NO se pausa automáticamente**
- Está disponible 24/7 mientras tengas horas disponibles

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Verifica que Root Directory esté en `backend`
- Verifica que `package.json` esté en `backend/`

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté configurada correctamente
- Usa la **Internal Database URL** si el servicio está en Render
- Usa la **External Database URL** si conectas desde fuera

### CORS errors desde Vercel
- Verifica que `CORS_ORIGIN` incluya `https://farma-gest.vercel.app`
- Verifica que la URL del backend en Vercel sea correcta (termina en `/api`)

### Backend no responde
- Revisa los logs en Render (pestaña "Logs")
- Verifica que el puerto sea correcto (10000 en plan gratuito)
- Verifica que todas las variables estén configuradas

### Cold Start (primera petición lenta)
- Es normal en plan gratuito después de 15 minutos de inactividad
- La primera petición puede tardar 30-60 segundos
- Las siguientes peticiones serán rápidas

---

## ✅ Checklist Final

- [ ] Cuenta creada en Render
- [ ] Base de datos PostgreSQL creada
- [ ] Servicio web creado y configurado
- [ ] Variables de entorno configuradas
- [ ] Backend desplegado y funcionando
- [ ] URL del backend obtenida
- [ ] Base de datos migrada (tablas creadas)
- [ ] Usuarios iniciales configurados
- [ ] Variable `REACT_APP_APIBACKEND` configurada en Vercel
- [ ] Vercel redeployado
- [ ] Login funcionando desde Vercel

---

## 🎯 Ventajas de Render para tu Proyecto

✅ **750 horas/mes** = Servicio corriendo 24/7 todo el mes  
✅ **Sin límite de tiempo** si no superas las horas  
✅ **Perfecto para proyectos académicos de 6 meses**  
✅ **PostgreSQL incluido gratis**  
✅ **Sin tarjeta de crédito requerida**  

---

## 🎓 Perfecto para Presentación

Render es ideal para tu proyecto porque:
- ✅ Funciona durante los 6 meses que necesitas
- ✅ No requiere pago
- ✅ PostgreSQL incluido
- ✅ Suficiente para demostrar tu trabajo

¡Buena suerte con tu proyecto! 🚀

