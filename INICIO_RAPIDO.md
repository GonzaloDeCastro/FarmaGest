# FarmaGest - Configuración del Proyecto

## 📁 Estructura del Proyecto

```
FarmaGest/
├── backend/          # API REST (Node.js/Express + PostgreSQL)
├── src/              # Frontend React
├── public/           # Archivos públicos
└── docs/             # Documentación
```

## 🚀 Inicio Rápido

### 1. Backend

```bash
cd backend
npm install
cp env.example .env
# Editar .env con tus credenciales
npm run dev
```

El backend estará en `http://localhost:5000`

### 2. Frontend

```bash
# En la raíz del proyecto
npm install
# Crear archivo .env con:
# REACT_APP_APIBACKEND=http://localhost:5000/api
npm start
```

El frontend estará en `http://localhost:3000`

## 📝 Variables de Entorno

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmagest
DB_USER=farmagest_user
DB_PASSWORD=farmagest123
```

### Frontend (.env)
```env
REACT_APP_APIBACKEND=http://localhost:5000/api
```

## 📚 Documentación

- [Configuración de Base de Datos](./CONFIGURACION_BD.md)
- [Backend README](./backend/README.md)
- [Creación de Base de Datos](./CREACION_BASE_DATOS.md)

## ✅ Estado Actual

- ✅ PostgreSQL instalado y configurado
- ✅ Base de datos `farmagest` creada
- ✅ Usuario `farmagest_user` creado
- ✅ Backend API creado con endpoints básicos
- ⏳ Frontend configurado (necesita variable de entorno)

## 🔄 Próximos Pasos

1. Configurar variable de entorno del frontend
2. Probar conexión backend-frontend
3. Configurar contraseña del usuario admin
4. Implementar autenticación JWT (opcional)
5. Agregar validaciones adicionales
6. Implementar reportes completos

