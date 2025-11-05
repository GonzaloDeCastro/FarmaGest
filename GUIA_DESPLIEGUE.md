# Guía: Conectar Frontend Vercel con Backend

## 📍 Situación Actual

- **Frontend Vercel**: https://farma-gest.vercel.app/
- **Backend Local**: http://localhost:5000 (solo accesible desde tu PC)
- **Base de Datos**: PostgreSQL local

## ⚠️ Problema

La aplicación en Vercel **NO puede conectarse** al backend local porque:
- `localhost` solo funciona en tu computadora
- Vercel está en internet y necesita una URL pública

## ✅ Solución: Desplegar Backend

### Opción 1: Desplegar Backend en Railway (Recomendado - Gratis)

1. **Crear cuenta en Railway:**
   - Ve a https://railway.app/
   - Conecta con GitHub

2. **Desplegar Backend:**
   ```bash
   # Desde la carpeta backend/
   # Railway detectará automáticamente Node.js
   ```

3. **Configurar Variables de Entorno en Railway:**
   ```
   DB_HOST=tu-postgres-host
   DB_PORT=5432
   DB_NAME=farmagest
   DB_USER=farmagest_user
   DB_PASSWORD=tu_password
   PORT=5000
   CORS_ORIGIN=https://farma-gest.vercel.app
   ```

4. **Obtener URL del Backend:**
   - Railway te dará una URL como: `https://tu-backend.railway.app`

5. **Configurar Vercel:**
   - Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
   - Agrega: `REACT_APP_APIBACKEND=https://tu-backend.railway.app/api`
   - Redeploya la aplicación

### Opción 2: Desplegar Backend en Render

1. Ve a https://render.com/
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables: Igual que Railway
5. Obtén la URL y configúrala en Vercel

### Opción 3: Usar Base de Datos en la Nube

Para producción, también necesitarás una base de datos PostgreSQL en la nube:
- **Railway PostgreSQL** (incluido gratis)
- **Render PostgreSQL** (incluido gratis)
- **Supabase** (https://supabase.com/)
- **ElephantSQL** (https://www.elephantsql.com/)

## 🔧 Configuración Necesaria

### 1. Actualizar CORS en Backend

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://farma-gest.vercel.app'  // Agregar esto
  ],
  credentials: true
}));
```

### 2. Variables de Entorno en Vercel

En el dashboard de Vercel:
```
REACT_APP_APIBACKEND=https://tu-backend-url.com/api
```

### 3. Variables de Entorno en Backend (Railway/Render)

```
DB_HOST=...
DB_PORT=5432
DB_NAME=farmagest
DB_USER=...
DB_PASSWORD=...
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://farma-gest.vercel.app
```

## 📋 Checklist

- [ ] Backend desplegado en Railway/Render
- [ ] Base de datos PostgreSQL en la nube creada
- [ ] Variables de entorno del backend configuradas
- [ ] CORS actualizado para permitir Vercel
- [ ] Variable `REACT_APP_APIBACKEND` configurada en Vercel
- [ ] Aplicación redeployada en Vercel
- [ ] Prueba de conexión desde Vercel al backend

## 🎯 Estado Actual

| Componente | Estado | Acción Necesaria |
|------------|--------|------------------|
| Frontend Vercel | ✅ Desplegado | Configurar variable de entorno |
| Backend Local | ✅ Funcionando | Desplegar en internet |
| Backend Producción | ❌ No existe | Desplegar en Railway/Render |
| Base de Datos Local | ✅ Funcionando | Migrar a base de datos en la nube |
| Integración | ❌ No conectada | Seguir pasos arriba |

