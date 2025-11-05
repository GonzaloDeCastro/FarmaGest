# 🚀 Guía Rápida: Configurar Variables y Migrar Base de Datos en Render

## ✅ Paso 1: Agregar Variables de Entorno

En tu servicio web de Render, ve a **"Environment"** y agrega estas variables:

```
NODE_ENV = production
PORT = 10000
DATABASE_URL = postgresql://farmagest_user:UUiS9GNhwqRn6fGdwv1RYfGfBbpiJeiR@dpg-d45av0ndiees73e7o9u0-a/farmagest
CORS_ORIGIN = http://localhost:3000,https://farma-gest.vercel.app
JWT_SECRET = clave_secreta_super_segura_cambiar_en_produccion_123456789
JWT_EXPIRES_IN = 24h
```

⚠️ **Nota sobre DATABASE_URL:**
- Si la Internal Database URL no funciona, usa la External Database URL:
  ```
  postgresql://farmagest_user:UUiS9GNhwqRn6fGdwv1RYfGfBbpiJeiR@dpg-d45av0ndiees73e7o9u0-a.oregon-postgres.render.com/farmagest
  ```

---

## ✅ Paso 2: Ejecutar Migración de Base de Datos

Después de que Render redeploye tu servicio, necesitas ejecutar la migración para crear las tablas.

### Opción A: Ejecutar desde tu máquina local (Recomendado)

1. Conecta tu base de datos local temporalmente a Render:
   ```powershell
   # En PowerShell, crea un archivo .env temporal
   $env:DATABASE_URL="postgresql://farmagest_user:UUiS9GNhwqRn6fGdwv1RYfGfBbpiJeiR@dpg-d45av0ndiees73e7o9u0-a.oregon-postgres.render.com/farmagest"
   ```

2. Ejecuta el script de migración:
   ```powershell
   cd backend
   node scripts/migrate.js
   ```

### Opción B: Ejecutar desde Render Shell (Alternativa)

1. En Render Dashboard, ve a tu servicio web
2. Haz clic en **"Shell"** (terminal web)
3. Ejecuta:
   ```bash
   node scripts/migrate.js
   ```

### Opción C: Ejecutar SQL directamente en Render

1. En Render Dashboard, ve a tu base de datos PostgreSQL
2. Haz clic en **"Connect"** o **"Open in pgAdmin"**
3. Ejecuta el contenido de `crear-esquema-farmagest.sql`

---

## ✅ Paso 3: Verificar Migración

Después de ejecutar la migración:

1. Ve a tu servicio web en Render
2. Abre la URL: `https://tu-backend-url.onrender.com/health`
3. Deberías ver: `{"status":"OK","database":"connected"}`

---

## ✅ Paso 4: Crear Usuario Admin

Ejecuta el script para crear el usuario admin:

```powershell
cd backend
node scripts/setupUsers.js
```

Esto creará:
- Usuario admin: `admin@farmagest.com` / contraseña: `admin123`
- Usuario de prueba: `test@farmagest.com` / contraseña: `test123`

---

## 🔍 Verificar que Todo Funciona

1. **Backend:** `https://tu-backend-url.onrender.com/health`
2. **Frontend:** Actualiza la URL del backend en Vercel para que apunte a Render
3. **Login:** Prueba iniciar sesión con el usuario admin

---

## ⚠️ Solución de Problemas

### Error de conexión a BD
- Verifica que DATABASE_URL esté correcta
- Prueba con la External Database URL si la Internal no funciona

### Error en migración
- Verifica que la base de datos esté completamente creada
- Espera 2-3 minutos después de crear la BD
- Ejecuta la migración desde tu máquina local con la External Database URL

### El servicio no responde
- Espera 5-10 minutos después del primer deploy
- Revisa los logs en la pestaña "Logs" de Render

---

**¿Listo para continuar? Avísame cuando hayas agregado las variables y ejecutado la migración.**

