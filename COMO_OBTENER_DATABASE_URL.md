# 📋 Cómo Obtener la DATABASE_URL en Render

## ⚠️ Importante

La **DATABASE_URL** se genera automáticamente cuando creas la base de datos PostgreSQL en Render.  
**No puedo dártela porque cada cuenta tiene URLs únicas.**

---

## 🔍 Pasos para Obtener la DATABASE_URL

### Paso 1: Crear Base de Datos PostgreSQL en Render

Si aún no has creado la base de datos:

1. En el dashboard de Render, haz clic en **"+ New +"**
2. Selecciona **"PostgreSQL"**
3. Configura:
   - **Name:** `farmagest-db`
   - **Database:** `farmagest`
   - **User:** `farmagest_user`
   - **Region:** Elige la más cercana
   - **PostgreSQL Version:** 18 o la más reciente
   - **Plan:** **Free** (750 hours/month)
4. Haz clic en **"Create Database"**
5. Espera 1-2 minutos mientras Render la crea

### Paso 2: Obtener la Internal Database URL

Una vez que la base de datos esté lista:

1. En el dashboard de Render, haz clic en tu base de datos PostgreSQL (la que acabas de crear)
2. Verás varias pestañas: **"Info"**, **"Data"**, **"Settings"**, etc.
3. Haz clic en la pestaña **"Info"**
4. Busca la sección **"Connection Information"** o **"Database URL"**
5. Verás dos URLs:
   - **Internal Database URL** ← Esta es la que necesitas
   - **External Database URL** (para conectar desde fuera de Render)

6. **Copia la Internal Database URL**
   - Se ve así: `postgresql://farmagest_user:password123@dpg-xxxxx-a.frankfurt-postgres.render.com:5432/farmagest_xxxx`
   - Comienza con `postgresql://`
   - Contiene usuario, contraseña, host y nombre de base de datos

---

## 📸 Dónde Encontrarla Visualmente

En Render Dashboard:
```
Dashboard → Tu Base de Datos PostgreSQL → Pestaña "Info" → "Internal Database URL"
```

---

## ✅ Después de Obtenerla

Una vez que tengas la Internal Database URL:

1. Ve a tu servicio web (backend)
2. Pestaña **"Environment"**
3. Agrega la variable:
   - **Key:** `DATABASE_URL`
   - **Value:** (Pega la Internal Database URL que copiaste)

---

## 🆘 Si No Ves la URL

Si no ves la Internal Database URL:

1. Verifica que la base de datos esté completamente creada (puede tardar 1-2 minutos)
2. Verifica que estés en la pestaña correcta ("Info")
3. Scroll hacia abajo en la página de "Info"
4. Busca "Connection Information" o "Connection String"

---

## 💡 Alternativa: Usar Variables Individuales

Si prefieres no usar DATABASE_URL, puedes usar variables individuales:

1. En la pestaña "Info" de tu base de datos, verás:
   - **Host**
   - **Port**
   - **Database**
   - **User**
   - **Password**

2. Agrega estas variables en tu servicio web:
   ```
   DB_HOST=(el Host que te muestra Render)
   DB_PORT=5432
   DB_NAME=(el Database que te muestra Render)
   DB_USER=(el User que te muestra Render)
   DB_PASSWORD=(el Password que te muestra Render)
   ```

**Pero es más fácil usar DATABASE_URL** porque Render te da toda la información en una sola variable.

---

## 🚀 Siguiente Paso

Una vez que tengas la DATABASE_URL:
1. Agrega todas las variables de entorno en tu servicio web
2. Render redeployará automáticamente
3. Verifica que el servicio esté corriendo

**¿Ya creaste la base de datos PostgreSQL en Render? Si no, avísame y te guío paso a paso.**

