# 🔧 Solución a "Sin Datos" y Menú Vacío

## Problemas Identificados

### 1. ⚠️ **Permisos No Encontrados** (Menú Vacío)
**Síntoma:** El sidebar del menú está completamente vacío  
**Causa:** No se encuentran permisos en `sessionStorage`  
**Evidencia:** Warnings en consola: "No se encontraron permisos en sessionStorage"

### 2. 📦 **Sin Datos en Productos**
**Síntoma:** Muestra "sin datos" en la tabla de productos  
**Causa:** Puede ser:
- No hay productos en la base de datos
- El backend no está respondiendo correctamente
- Error en la llamada al API

---

## Soluciones

### ✅ Solución 1: Verificar Permisos en sessionStorage

**Paso 1:** Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver qué hay en sessionStorage
const logged = JSON.parse(sessionStorage.getItem("logged"));
console.log("Datos completos:", logged);
console.log("Sesión:", logged?.sesion);
console.log("Permisos:", logged?.sesion?.permisos);
```

**Paso 2:** Verifica la estructura:

**Estructura esperada:**
```javascript
{
  sesion: {
    usuario_id: 1,
    correo: "admin@example.com",
    permisos: ["gestion_productos", "gestion_ventas", "gestion_clientes", ...],
    sesion_id: 123,
    rol: "admin"
  }
}
```

**Si no hay permisos:**
- El backend no está devolviendo los permisos en el login
- Necesitas verificar el endpoint de login en el backend

### ✅ Solución 2: Verificar Productos

**Paso 1:** Abre la consola del navegador (F12) → pestaña "Network"

**Paso 2:** Recarga la página (F5)

**Paso 3:** Busca la llamada a `/api/productos`

**Paso 4:** Verifica:
- ¿La llamada se hace? (debe haber un request)
- ¿Qué status code devuelve? (debe ser 200)
- ¿Qué datos devuelve? (click en el request → pestaña "Response")

**Si la llamada falla:**
- Verifica que el backend esté corriendo
- Verifica que el endpoint `/api/productos` exista
- Verifica las credenciales/autenticación

**Si la llamada es exitosa pero no hay datos:**
- No hay productos en la base de datos
- Necesitas crear productos de prueba

---

## Solución Temporal: Agregar Permisos Manualmente

Si necesitas usar la aplicación mientras corriges el backend, puedes agregar permisos temporalmente:

**En la consola del navegador, ejecuta:**

```javascript
// Obtener datos actuales
const logged = JSON.parse(sessionStorage.getItem("logged"));

// Agregar permisos si no existen
if (logged && logged.sesion && !logged.sesion.permisos) {
  logged.sesion.permisos = [
    "gestion_productos",
    "gestion_ventas",
    "gestion_clientes",
    "gestion_proveedores",
    "gestion_obras_sociales",
    "gestion_usuarios"
  ];
  
  // Guardar de nuevo
  sessionStorage.setItem("logged", JSON.stringify(logged));
  
  // Recargar la página
  window.location.reload();
}
```

---

## Verificar Backend

### Verificar que el backend esté corriendo:

```bash
# En otra terminal, verifica:
netstat -ano | findstr :5000
```

### Verificar endpoint de productos:

Abre en el navegador:
```
http://localhost:5000/api/productos?page=1&pageSize=8&search=
```

**Respuesta esperada:**
```json
[
  {
    "producto_id": 1,
    "Nombre": "Producto 1",
    "Codigo": "PROD001",
    "Precio": 1000,
    "Stock": 50,
    ...
  },
  ...
]
```

### Verificar endpoint de login:

**Endpoint:** `GET /api/usuarios/login?correo=...&contrasena=...`

**Respuesta esperada debe incluir:**
```json
{
  "usuario_id": 1,
  "correo": "admin@example.com",
  "permisos": ["gestion_productos", "gestion_ventas", ...],
  "sesion_id": 123,
  ...
}
```

---

## Crear Datos de Prueba

### Si no hay productos, puedes crear algunos:

**Opción 1: Desde la aplicación**
1. Click en "Nuevo Producto"
2. Completa el formulario
3. Guarda

**Opción 2: Directamente en la base de datos**

Si tienes acceso a PostgreSQL:

```sql
INSERT INTO productos (nombre, codigo, marca, categoria_id, precio, stock, usuario_id)
VALUES 
  ('Paracetamol 500mg', 'PAR500', 'Genérico', NULL, 800, 100, 1),
  ('Ibuprofeno 600mg', 'IBU600', 'Bayer', NULL, 1500, 50, 1),
  ('Aspirina 100mg', 'ASP100', 'Bayer', NULL, 600, 75, 1);
```

---

## Checklist de Verificación

- [ ] Verificar que el backend esté corriendo (puerto 5000)
- [ ] Verificar que el frontend esté corriendo (puerto 3000)
- [ ] Verificar permisos en sessionStorage (consola)
- [ ] Verificar llamadas al API (Network tab)
- [ ] Verificar respuesta del backend (Network → Response)
- [ ] Verificar que hay productos en la base de datos
- [ ] Si no hay productos, crear algunos de prueba

---

## Próximos Pasos

1. **Ejecuta el comando en la consola** para ver qué hay en sessionStorage
2. **Verifica la pestaña Network** para ver si hay llamadas al API
3. **Comparte los resultados** y te ayudo a corregir el problema específico

---

**Fecha:** 2024  
**Estado:** Requiere verificación del backend y sessionStorage



