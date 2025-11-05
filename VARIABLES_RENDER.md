# 🔐 Variables de Entorno para Render

## 📋 Variables que Necesitas Configurar en Render

Cuando estés en tu servicio web en Render, ve a la pestaña **"Environment"** y agrega estas variables **UNA POR UNA**:

---

## ✅ Variables Obligatorias

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
**Nota:** Render asigna el puerto automáticamente. En plan gratuito suele ser 10000, pero Render lo manejará automáticamente.

### 3. DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://user:password@host:5432/database
```
**⚠️ IMPORTANTE:** Esta variable la obtienes de tu base de datos PostgreSQL en Render:
1. Ve a tu base de datos PostgreSQL en Render
2. Pestaña **"Info"**
3. Copia la **"Internal Database URL"**
4. Pégala aquí como valor

**Ejemplo de cómo se ve:**
```
postgresql://farmagest_user:abc123xyz@dpg-xxxxx-a.frankfurt-postgres.render.com:5432/farmagest_xxxx
```

---

## ✅ Variables Opcionales pero Recomendadas

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
**Nota:** Cambia esta contraseña por una más segura en producción.

### 6. JWT_EXPIRES_IN
```
Key: JWT_EXPIRES_IN
Value: 24h
```

---

## 📝 Cómo Agregar Variables en Render

1. En tu servicio web, ve a la pestaña **"Environment"**
2. Haz clic en **"Add Environment Variable"**
3. Ingresa el **Key** y el **Value**
4. Haz clic en **"Save"**
5. Repite para cada variable

**Render guardará automáticamente y redeployará el servicio.**

---

## 🎯 Variables Mínimas Necesarias

Si solo quieres lo esencial para empezar:

**Mínimo requerido:**
- `NODE_ENV=production`
- `PORT=10000`
- `DATABASE_URL=postgresql://...` (de tu base de datos)

**Recomendado agregar también:**
- `CORS_ORIGIN=http://localhost:3000,https://farma-gest.vercel.app`
- `JWT_SECRET=clave_secreta_super_segura_cambiar_en_produccion_123456789`
- `JWT_EXPIRES_IN=24h`

---

## 🔍 Dónde Obtener DATABASE_URL

En Render Dashboard:
1. Ve a tu base de datos PostgreSQL
2. Haz clic en ella
3. Ve a la pestaña **"Info"**
4. Busca **"Internal Database URL"**
5. Copia toda la URL (comienza con `postgresql://`)
6. Pégala como valor de `DATABASE_URL`

---

## ✅ Checklist de Variables

- [ ] NODE_ENV = production
- [ ] PORT = 10000
- [ ] DATABASE_URL = (Internal Database URL de Render)
- [ ] CORS_ORIGIN = http://localhost:3000,https://farma-gest.vercel.app
- [ ] JWT_SECRET = clave_secreta_super_segura_cambiar_en_produccion_123456789
- [ ] JWT_EXPIRES_IN = 24h

---

## 💡 Nota Importante

**No necesitas estas variables si usas DATABASE_URL:**
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD

El código detecta automáticamente `DATABASE_URL` y la usa. Si no existe, usa las variables individuales.

---

## 🚀 Después de Configurar Variables

Una vez que agregues todas las variables:
1. Render redeployará automáticamente
2. Ve a la pestaña **"Events"** para ver el progreso
3. Espera 3-5 minutos
4. Cuando veas "Your service is live", está listo

