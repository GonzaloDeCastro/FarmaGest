# 🔧 Solución: Cambiar Start Command Directamente

## ✅ Comandos Actuales (Correctos)

- Build Command: `cd backend && npm install` ✅
- Start Command: `cd backend && npm start` ✅

## 🔧 Prueba Alternativa

Si el servidor aún no inicia, prueba cambiar el **Start Command** a:

```
cd backend && node start.js
```

Esto ejecuta directamente el script sin pasar por npm.

---

## 📋 Pasos para Cambiar

1. En Render → Settings → Build & Deploy
2. En **Start Command**, haz clic en **Edit**
3. Cambia a: `cd backend && node start.js`
4. Guarda los cambios
5. Render redeployará automáticamente

---

## 🔍 Revisar Logs Completos

Después del cambio, ve a la pestaña **"Logs"** y busca:

- Si ves `🚀 Iniciando servidor FarmaGest...` → El script está ejecutándose
- Si ves errores antes de ese mensaje → Hay un problema con npm o las dependencias
- Si no ves ningún log de nuestro código → El comando no se está ejecutando

---

## 🆘 Si Aún No Funciona

Comparte los logs completos de Render (especialmente la sección "Starting..." y los primeros errores) para diagnosticar mejor el problema.

