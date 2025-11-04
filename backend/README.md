# Backend API - FarmaGest

API REST para el sistema de gestión de farmacia FarmaGest.

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus credenciales de PostgreSQL:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=farmagest
   DB_USER=farmagest_user
   DB_PASSWORD=farmagest123
   PORT=5000
   ```

3. **Iniciar servidor:**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

El servidor estará disponible en `http://localhost:5000`

## 📋 Endpoints

### Usuarios
- `GET /api/usuarios` - Listar usuarios (con paginación)
- `GET /api/usuarios/roles` - Obtener roles
- `GET /api/usuarios/login` - Login de usuario
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `PUT /api/usuarios/pwd/:correo` - Actualizar contraseña

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/categorias` - Obtener categorías
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Obras Sociales
- `GET /api/obras-sociales` - Listar obras sociales
- `POST /api/obras-sociales` - Crear obra social
- `PUT /api/obras-sociales/:id` - Actualizar obra social
- `DELETE /api/obras-sociales/:id` - Eliminar obra social

### Proveedores
- `GET /api/proveedores` - Listar proveedores
- `POST /api/proveedores` - Crear proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Eliminar proveedor

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Crear venta

### Sesiones
- `GET /api/sesiones` - Listar sesiones

### Reportes
- `GET /api/reportes` - Generar reportes

### Auditoría
- `GET /api/auditoria` - Obtener auditoría

## 🔧 Configuración

### Variables de Entorno
- `PORT` - Puerto del servidor (default: 5000)
- `NODE_ENV` - Entorno (development/production)
- `DB_HOST` - Host de PostgreSQL
- `DB_PORT` - Puerto de PostgreSQL
- `DB_NAME` - Nombre de la base de datos
- `DB_USER` - Usuario de PostgreSQL
- `DB_PASSWORD` - Contraseña de PostgreSQL
- `JWT_SECRET` - Clave secreta para JWT
- `CORS_ORIGIN` - Origen permitido para CORS

## 📝 Notas

- El usuario administrador por defecto (`admin@farmagest.com`) necesita tener su contraseña configurada desde el backend.
- Las contraseñas se almacenan con bcrypt.
- Los endpoints de eliminación hacen "soft delete" (marcan como inactivo).

## 🐛 Troubleshooting

Si hay problemas de conexión:
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que la base de datos `farmagest` exista
4. Prueba la conexión: `GET /health`

