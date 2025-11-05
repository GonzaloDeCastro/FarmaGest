# 📋 Checklist: Variables de Entorno para Render

## ✅ Variables que Debes Agregar (Una por Una)

En tu servicio web en Render, ve a **"Environment"** y agrega estas variables:

---

### ✅ Variable 1
```
Key: NODE_ENV
Value: production
```

### ✅ Variable 2
```
Key: PORT
Value: 10000
```

### ✅ Variable 3
```
Key: DATABASE_URL
Value: (Pega aquí la Internal Database URL que copiaste)
```

### ✅ Variable 4
```
Key: CORS_ORIGIN
Value: http://localhost:3000,https://farma-gest.vercel.app
```

### ✅ Variable 5
```
Key: JWT_SECRET
Value: clave_secreta_super_segura_cambiar_en_produccion_123456789
```

### ✅ Variable 6
```
Key: JWT_EXPIRES_IN
Value: 24h
```

---

## 📝 Cómo Agregar Cada Variable

1. Haz clic en **"Add Environment Variable"**
2. Ingresa el **Key** (nombre de la variable)
3. Ingresa el **Value** (valor de la variable)
4. Haz clic en **"Save"**
5. Repite para cada variable

**Render guardará automáticamente y comenzará a redeployar.**

---

## ✅ Checklist de Verificación

- [ ] NODE_ENV agregada
- [ ] PORT agregada
- [ ] DATABASE_URL agregada (con la Internal Database URL)
- [ ] CORS_ORIGIN agregada
- [ ] JWT_SECRET agregada
- [ ] JWT_EXPIRES_IN agregada

---

## 🚀 Después de Agregar Todas las Variables

1. Render comenzará a redeployar automáticamente
2. Ve a la pestaña **"Events"** para ver el progreso
3. Espera 3-5 minutos
4. Cuando veas "Your service is live", está listo

---

## 🔍 Verificar que Funciona

1. Render te dará una URL (arriba del dashboard)
2. Ve a: `https://tu-backend-url.onrender.com/health`
3. Deberías ver: `{"status":"OK","database":"connected"}`

---

## ⚠️ Si Tienes Problemas

- **Error de conexión a BD:** Verifica que DATABASE_URL esté correcta
- **Error en deploy:** Revisa los logs en la pestaña "Logs"
- **No responde:** Espera unos minutos más (el primer deploy puede tardar)

---

**¿Ya agregaste todas las variables? Avísame cuando termines y continuamos con la migración de la base de datos.**

