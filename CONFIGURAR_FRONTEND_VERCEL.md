# 🔧 Configurar Frontend en Vercel para Apuntar a Render

## ✅ URL del Backend

Tu backend en Render está en:
```
https://farmagest-backend-1.onrender.com
```

---

## 📋 Pasos para Configurar en Vercel

### Paso 1: Ve a tu Proyecto en Vercel

1. Abre https://vercel.com
2. Inicia sesión si es necesario
3. Ve a tu proyecto `FarmaGest` o `farma-gest`

### Paso 2: Ir a Settings → Environment Variables

1. En tu proyecto, haz clic en **"Settings"**
2. En el menú lateral, haz clic en **"Environment Variables"**

### Paso 3: Agregar Variable de Entorno

1. Haz clic en **"Add New"**
2. Agrega esta variable:

```
Name: REACT_APP_APIBACKEND
Value: https://farmagest-backend-1.onrender.com
```

3. Selecciona los ambientes:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opcional, para desarrollo local)

4. Haz clic en **"Save"**

### Paso 4: Redeployar

1. Después de agregar la variable, ve a la pestaña **"Deployments"**
2. Haz clic en los **"..."** (tres puntos) del último deployment
3. Selecciona **"Redeploy"**
4. Confirma el redeploy

**O simplemente espera:** Vercel puede redeployar automáticamente al detectar cambios en las variables de entorno.

---

## ✅ Verificación

Después del redeploy:

1. Ve a tu frontend: https://farma-gest.vercel.app
2. Intenta hacer login con:
   - **Email:** `admin@farmagest.com`
   - **Contraseña:** `admin123`

3. Si funciona, ¡todo está configurado correctamente!

---

## 🔍 Verificar que Funciona

Abre la consola del navegador (F12) y verifica:
- Las llamadas API deberían ir a `https://farmagest-backend-1.onrender.com`
- No debería haber errores de CORS
- El login debería funcionar

---

## ⚠️ Si Hay Problemas

### Error de CORS
- Verifica que `CORS_ORIGIN` en Render incluya `https://farma-gest.vercel.app`

### El frontend no se conecta
- Verifica que la variable `REACT_APP_APIBACKEND` esté correctamente configurada
- Verifica que el backend esté "Live" en Render
- Espera unos minutos después del redeploy

---

**Después de configurar la variable en Vercel y redeployar, tu aplicación debería estar completamente funcional.**

