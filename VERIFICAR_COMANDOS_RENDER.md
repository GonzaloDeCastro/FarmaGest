# ✅ Guía: Verificar Build Command y Start Command en Render

## 📋 Paso 1: Acceder a la Configuración

1. Ve a tu **Render Dashboard**: https://dashboard.render.com
2. Inicia sesión si es necesario
3. Haz clic en tu servicio web: **farmagest-backend-1** (o el nombre que tenga)
4. Haz clic en la pestaña **"Settings"** (Configuración)

---

## 📋 Paso 2: Verificar Build Command

En la sección **"Build Command"**, debe estar configurado exactamente así:

```
cd backend && npm install
```

**O también puede ser:**
```
cd backend; npm install
```

⚠️ **Importante:**
- NO debe ser solo `npm install` (sin el `cd backend`)
- NO debe ser `npm install && cd backend`
- Debe incluir `cd backend` ANTES de `npm install`

---

## 📋 Paso 3: Verificar Start Command

En la sección **"Start Command"**, debe estar configurado exactamente así:

```
cd backend && npm start
```

**O también puede ser:**
```
cd backend; npm start
```

⚠️ **Importante:**
- NO debe ser solo `npm start` (sin el `cd backend`)
- NO debe ser `node server.js` (sin el `cd backend`)
- Debe incluir `cd backend` ANTES de `npm start`

---

## 📋 Paso 4: Verificar Root Directory

En la sección **"Root Directory"** (Directorio Raíz):

- Debe estar **vacío** o dejarse en blanco
- NO debe tener ningún valor como `/backend` o `backend`

---

## ✅ Configuración Correcta Completa

```
Build Command:  cd backend && npm install
Start Command:  cd backend && npm start
Root Directory: (vacío)
```

---

## 🔧 Cómo Corregir si Está Mal

1. En la pestaña **"Settings"** de tu servicio web
2. Desplázate hasta **"Build & Deploy"**
3. Busca **"Build Command"** y **"Start Command"**
4. Si están mal, edítalos con los valores correctos:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Haz clic en **"Save Changes"**
6. Render redeployará automáticamente

---

## 🆘 Si No Ves Estas Opciones

Si no ves las opciones de Build Command y Start Command:

1. Ve a **"Settings"**
2. Busca la sección **"Build & Deploy"** o **"Build"**
3. Si aún no las ves, puede ser que Render esté usando detección automática
4. En ese caso, Render debería detectar automáticamente que es un proyecto Node.js

---

## 📸 Ubicación Visual

```
Servicio Web → Settings → Build & Deploy
  ├── Build Command: cd backend && npm install
  ├── Start Command: cd backend && npm start
  └── Root Directory: (vacío)
```

---

## ✅ Después de Verificar/Corregir

1. Guarda los cambios
2. Render comenzará a redeployar automáticamente
3. Ve a la pestaña **"Logs"** para ver el progreso
4. Deberías ver:
   ```
   ==> Building...
   cd backend && npm install
   ...
   ==> Starting...
   cd backend && npm start
   ```

---

**¿Qué encontraste en Build Command y Start Command? Compárteme los valores actuales y te ayudo a corregirlos si es necesario.**

