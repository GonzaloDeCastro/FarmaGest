# 🔍 Cómo Encontrar la URL de tu Backend en Render

## ⚠️ Importante

La URL que me diste es la **DATABASE_URL** (de la base de datos).  
Necesito la **URL del servicio web** (donde está tu backend Node.js/Express).

---

## 📋 Dónde Encontrarla

### Si YA creaste el servicio web en Render:

1. Ve a tu **Render Dashboard** (https://dashboard.render.com)
2. Busca tu servicio web (debería llamarse algo como `farmagest-backend` o similar)
3. Haz clic en él
4. La URL aparece **arriba del dashboard**, al lado del nombre del servicio
5. Se ve así: `https://farmagest-backend-xxxx.onrender.com`

**Esa es la URL que necesito.**

---

## 🔧 Si AÚN NO has creado el servicio web:

Necesitas crear el servicio web primero. Sigue estos pasos:

### Paso 1: Crear Servicio Web en Render

1. En Render Dashboard, haz clic en **"+ New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub:
   - Selecciona `FarmaGest`
   - Haz clic en **"Connect"**
4. Configura el servicio:
   - **Name:** `farmagest-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** (deja vacío o `/`)
5. Haz clic en **"Create Web Service"**

### Paso 2: Configurar Variables de Entorno

Ya las agregaste antes, pero verifica que estén:
- `NODE_ENV = production`
- `PORT = 10000`
- `DATABASE_URL = postgresql://farmagest_user:UUiS9GNhwqRn6fGdwv1RYfGfBbpiJeiR@dpg-d45av0ndiees73e7o9u0-a/farmagest`
- `CORS_ORIGIN = http://localhost:3000,https://farma-gest.vercel.app`
- `JWT_SECRET = clave_secreta_super_segura_cambiar_en_produccion_123456789`
- `JWT_EXPIRES_IN = 24h`

### Paso 3: Obtener la URL

Una vez deployado, Render te dará una URL como:
- `https://farmagest-backend-xxxx.onrender.com`

**Esa es la URL que necesito para actualizar el frontend.**

---

## 🆘 ¿No ves el servicio web?

Si no ves ningún servicio web en Render, significa que aún no lo creaste.  
Sigue los pasos de arriba para crearlo.

---

## ✅ Después de Obtenerla

Una vez que tengas la URL del servicio web:
1. Te ayudo a actualizar la variable `REACT_APP_APIBACKEND` en Vercel
2. Vercel redeployará automáticamente
3. El frontend se conectará al backend en Render

---

**¿Ya creaste el servicio web en Render? Si sí, compárteme la URL. Si no, avísame y te guío paso a paso.**

