# 📖 Guía Paso a Paso: Configurar Frontend en Vercel

## 🎯 Objetivo

Configurar la variable de entorno `REACT_APP_APIBACKEND` en Vercel para que el frontend se conecte al backend en Render.

---

## 📋 Paso 1: Abrir Vercel

1. Abre tu navegador web
2. Ve a: **https://vercel.com**
3. Inicia sesión con tu cuenta (GitHub, Google, etc.)

---

## 📋 Paso 2: Encontrar tu Proyecto

1. En el dashboard de Vercel, busca tu proyecto
2. El proyecto debería llamarse algo como:
   - `FarmaGest`
   - `farma-gest`
   - O el nombre que le diste al proyecto
3. **Haz clic en el nombre del proyecto**

---

## 📋 Paso 3: Ir a Settings (Configuración)

1. En la parte superior del proyecto, verás varias pestañas:
   - **Overview** | **Deployments** | **Analytics** | **Settings** | etc.
2. **Haz clic en "Settings"** (Configuración)

---

## 📋 Paso 4: Ir a Environment Variables

1. En el menú lateral izquierdo (dentro de Settings), verás:
   - General
   - **Environment Variables** ← Haz clic aquí
   - Git
   - Domains
   - etc.

2. **Haz clic en "Environment Variables"**

---

## 📋 Paso 5: Agregar Nueva Variable

1. Verás una sección que dice **"Environment Variables"**
2. Haz clic en el botón **"Add New"** o **"Add"** (Agregar nueva)

---

## 📋 Paso 6: Configurar la Variable

En el formulario que aparece, completa:

### Name (Nombre):
```
REACT_APP_APIBACKEND
```
⚠️ **Importante:** Debe escribirse exactamente así, con mayúsculas y guiones bajos.

### Value (Valor):
```
https://farmagest-backend-1.onrender.com
```

### Environments (Ambientes):
Selecciona todas las casillas:
- ✅ **Production** (Producción)
- ✅ **Preview** (Vista previa)
- ✅ **Development** (Desarrollo) - Opcional pero recomendado

---

## 📋 Paso 7: Guardar

1. Haz clic en el botón **"Save"** (Guardar)
2. Verás que la variable aparece en la lista

---

## 📋 Paso 8: Redeployar (Redesplegar)

1. Ve a la pestaña **"Deployments"** (en la parte superior)
2. Encontrarás una lista de deployments
3. En el **último deployment** (el más reciente), verás **"..."** (tres puntos) a la derecha
4. **Haz clic en los tres puntos**
5. Selecciona **"Redeploy"**
6. Confirma haciendo clic en **"Redeploy"** nuevamente

---

## ⏳ Paso 9: Esperar el Redeploy

1. Vercel comenzará a redesplegar tu aplicación
2. Verás el progreso en tiempo real
3. Espera 2-5 minutos hasta que veas **"Ready"** o **"Success"**

---

## ✅ Paso 10: Verificar que Funciona

1. Ve a tu frontend: **https://farma-gest.vercel.app**
2. Intenta hacer login con:
   - **Email:** `admin@farmagest.com`
   - **Contraseña:** `admin123`
3. Si funciona, ¡todo está configurado correctamente!

---

## 🆘 Solución de Problemas

### No encuentro el proyecto
- Verifica que estés logueado con la cuenta correcta
- Busca en "Projects" del dashboard

### No veo "Environment Variables"
- Asegúrate de estar en la pestaña **"Settings"**
- Busca en el menú lateral izquierdo

### La variable no funciona después del redeploy
- Verifica que escribiste `REACT_APP_APIBACKEND` correctamente (con mayúsculas)
- Verifica que el valor sea exactamente `https://farmagest-backend-1.onrender.com`
- Espera unos minutos más y vuelve a intentar

### El frontend no se conecta al backend
- Abre la consola del navegador (F12)
- Ve a la pestaña "Console" o "Network"
- Verifica si hay errores de CORS o conexión

---

## 📸 Ubicación Visual

```
Vercel Dashboard
  └── Tu Proyecto (FarmaGest)
      └── Settings (Pestaña superior)
          └── Environment Variables (Menú lateral)
              └── Add New (Botón)
                  └── Name: REACT_APP_APIBACKEND
                      Value: https://farmagest-backend-1.onrender.com
                      Environments: ✅ Production, Preview, Development
```

---

**¿En qué paso estás? Si tienes alguna duda específica, avísame y te ayudo.**

