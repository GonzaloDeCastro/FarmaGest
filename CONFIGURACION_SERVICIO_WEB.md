# ✅ Configuración Completa del Servicio Web en Render

## ✅ Variables de Entorno

Carga estas variables **UNA POR UNA** en tu servicio web:

### 1. NODE_ENV
```
Key: NODE_ENV
Value: production
```

### 2. PORT
```
Key: PORT
Value: 10000
```

### 3. DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://farmagest_user:UUiS9GNhwqRn6fGdwv1RYfGfBbpiJeiR@dpg-d45av0ndiees73e7o9u0-a/farmagest
```
⚠️ **Nota:** Si la Internal DB URL no funciona cuando Render deploye, cambia a la External:
```
postgresql://farmagest_user:UUiS9GNhwqRn6fGdwv1RYfGfBbpiJeiR@dpg-d45av0ndiees73e7o9u0-a.oregon-postgres.render.com/farmagest
```

### 4. CORS_ORIGIN
```
Key: CORS_ORIGIN
Value: http://localhost:3000,https://farma-gest.vercel.app
```

### 5. JWT_SECRET
```
Key: JWT_SECRET
Value: clave_secreta_super_segura_cambiar_en_produccion_123456789
```

### 6. JWT_EXPIRES_IN
```
Key: JWT_EXPIRES_IN
Value: 24h
```

---

## ⚙️ Configuración del Servicio Web

Verifica que estos comandos estén configurados correctamente:

### Build Command
```
cd backend && npm install
```

### Start Command
```
cd backend && npm start
```

### Root Directory
```
(Dejar vacío o dejar el valor por defecto)
```

---

## ✅ Después de Configurar

1. ✅ Agregar todas las variables de entorno
2. ✅ Verificar Build Command y Start Command
3. ⏳ Render comenzará a deployar automáticamente
4. ⏳ Espera 3-5 minutos
5. ⏳ Cuando veas "Your service is live", está listo

---

## 🔍 Obtener la URL del Servicio

Una vez que el servicio esté deployado:

1. Ve a tu servicio web en Render
2. Arriba del dashboard verás la **Service URL**
3. Debería verse así: `https://farmagest-backend-xxxx.onrender.com`
4. **Esa es la URL que necesito para actualizar el frontend**

---

## 🧪 Verificar que Funciona

1. Ve a: `https://tu-backend-url.onrender.com/health`
2. Deberías ver: `{"status":"OK","database":"connected"}`

---

**Después de cargar las variables y que Render termine de deployar, compárteme la Service URL para actualizar el frontend.**

