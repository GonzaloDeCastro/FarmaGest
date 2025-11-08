# 📍 Dónde se Ejecuta `JSON.parse(sessionStorage.getItem("logged"))`

## Resumen

Se ejecuta en **17 lugares** diferentes del código. Aquí está el desglose completo:

---

## 🔄 Flujo de Ejecución

### 1. **Se GUARDA** (solo en 1 lugar):
**Archivo:** `src/components/login/FormLogin.js`  
**Línea:** 34-36  
**Cuándo:** Después de que el usuario hace login exitoso

```javascript
sessionStorage.setItem(
  "logged",
  JSON.stringify({ sesion: UsuarioLogin })
);
```

---

## 📖 Se LEE (en 17 lugares):

### **A) Rutas de Protección** (11 archivos)

#### 1. **PrivateRoute.js** (Ruta General)
**Ubicación:** `src/routes/PrivateRoute.js:6`  
**Propósito:** Verifica si el usuario está logueado antes de mostrar cualquier ruta privada  
**Cuándo se ejecuta:** Cada vez que se intenta acceder a una ruta privada

```javascript
const logged = JSON.parse(sessionStorage.getItem("logged"));
if (logged !== null) {
  return <Outlet context={{ logged }} />;
}
```

#### 2. **PublicRoute.js**
**Ubicación:** `src/routes/PublicRoute.js:6`  
**Propósito:** Redirige a usuarios logueados que intentan acceder a rutas públicas (como login)  
**Cuándo se ejecuta:** Al intentar acceder a `/login` u otras rutas públicas

#### 3. **Router.js**
**Ubicación:** `src/routes/Router.js:26`  
**Propósito:** Lógica de routing principal  
**Cuándo se ejecuta:** Al cargar la aplicación o cambiar de ruta

#### 4. **PrivateUsuarios.js**
**Ubicación:** `src/routes/PrivateUsuarios.js:7`  
**Propósito:** Verifica permisos específicos para módulo de usuarios  
**Cuándo se ejecuta:** Al intentar acceder a `/usuarios`

#### 5. **PrivateVentas.js**
**Ubicación:** `src/routes/PrivateVentas.js:7`  
**Propósito:** Verifica permisos para módulo de ventas  
**Cuándo se ejecuta:** Al intentar acceder a `/ventas`

#### 6. **PrivateClientes.js**
**Ubicación:** `src/routes/PrivateClientes.js:7`  
**Propósito:** Verifica permisos para módulo de clientes  
**Cuándo se ejecuta:** Al intentar acceder a `/clientes`

#### 7. **PrivateProveedores.js**
**Ubicación:** `src/routes/PrivateProveedores.js:7`  
**Propósito:** Verifica permisos para módulo de proveedores  
**Cuándo se ejecuta:** Al intentar acceder a `/proveedores`

#### 8. **PrivateObrasSociales.js**
**Ubicación:** `src/routes/PrivateObrasSociales.js:7`  
**Propósito:** Verifica permisos para módulo de obras sociales  
**Cuándo se ejecuta:** Al intentar acceder a `/obras-sociales`

#### 9. **PrivatePedidos.js**
**Ubicación:** `src/routes/PrivatePedidos.js:7`  
**Propósito:** Verifica permisos para módulo de pedidos  
**Cuándo se ejecuta:** Al intentar acceder a `/pedidos`

---

### **B) Componentes de Layout y Navegación** (1 archivo)

#### 10. **Layout.js** ⭐ (MÁS IMPORTANTE PARA EL MENÚ)
**Ubicación:** `src/shared/Layout.js:22`  
**Propósito:** Obtiene permisos para mostrar/ocultar opciones del menú  
**Cuándo se ejecuta:** Cada vez que se renderiza cualquier página (ya que Layout envuelve todas las páginas)  
**Problema actual:** Aquí es donde se verifica si hay permisos para mostrar el menú

```javascript
const logged = JSON.parse(sessionStorage.getItem("logged"));
let permisos = [];
if (logged && logged.sesion) {
  permisos = Array.isArray(logged.sesion.permisos) 
    ? logged.sesion.permisos 
    : (logged.sesion.permisos ? [logged.sesion.permisos] : []);
}
```

---

### **C) Componentes de Módulos** (6 archivos)

#### 11. **Products.js** (Productos)
**Ubicación:** `src/components/Productos/Products.js:19`  
**Propósito:** Obtiene `usuarioId` y `sesion` para operaciones de productos  
**Cuándo se ejecuta:** Al cargar la página de productos

```javascript
const logged = JSON.parse(sessionStorage.getItem("logged"));
const usuarioId = logged?.sesion?.usuario_id;
const sesion = logged?.sesion?.sesion_id;
```

#### 12. **Ventas.js**
**Ubicación:** `src/components/Ventas/Ventas.js:14`  
**Propósito:** Obtiene `usuarioId` y `sesion` para operaciones de ventas  
**Cuándo se ejecuta:** Al cargar la página de ventas

#### 13. **Usuarios.js**
**Ubicación:** `src/components/Usuarios/Usuarios.js:22`  
**Propósito:** Obtiene información del usuario logueado  
**Cuándo se ejecuta:** Al cargar la página de usuarios

#### 14. **UsuarioLogout.js**
**Ubicación:** `src/components/Usuarios/UsuarioLogout.js:30`  
**Propósito:** Muestra información del usuario en el header y permite logout  
**Cuándo se ejecuta:** Cada vez que se renderiza el Layout (ya que está en el header)

#### 15. **Proveedores.js**
**Ubicación:** `src/components/Proveedores/Proveedores.js:17`  
**Propósito:** Obtiene información del usuario para operaciones  
**Cuándo se ejecuta:** Al cargar la página de proveedores

#### 16. **Clientes.js**
**Ubicación:** `src/components/Clientes/Clientes.js:23`  
**Propósito:** Obtiene información del usuario para operaciones  
**Cuándo se ejecuta:** Al cargar la página de clientes

#### 17. **ObrasSociales.js**
**Ubicación:** `src/components/ObrasSociales/ObrasSociales.js:17`  
**Propósito:** Obtiene información del usuario para operaciones  
**Cuándo se ejecuta:** Al cargar la página de obras sociales

---

## 🔍 Dónde VERIFICAR el Problema del Menú

### **El lugar más importante es:**

**`src/shared/Layout.js:22-38`**

Este es el componente que se ejecuta en **TODAS las páginas** y es donde se verifica si hay permisos para mostrar el menú.

### **Para debuggear, agrega esto temporalmente en Layout.js:**

```javascript
const logged = JSON.parse(sessionStorage.getItem("logged"));

// DEBUG: Ver qué hay en logged
console.log('🔍 DEBUG Layout - logged:', logged);
console.log('🔍 DEBUG Layout - sesion:', logged?.sesion);
console.log('🔍 DEBUG Layout - permisos:', logged?.sesion?.permisos);

let permisos = [];
if (logged && logged.sesion) {
  permisos = Array.isArray(logged.sesion.permisos) 
    ? logged.sesion.permisos 
    : (logged.sesion.permisos ? [logged.sesion.permisos] : []);
}

console.log('🔍 DEBUG Layout - permisos finales:', permisos);
```

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────┐
│  FormLogin.js (GUARDA)                  │
│  sessionStorage.setItem("logged", ...)  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Layout.js (LEE - MÁS IMPORTANTE)       │
│  └─> Verifica permisos para menú        │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│ PrivateRoute │  │  Componentes │
│ PublicRoute  │  │  (Products,  │
│ PrivateXXX   │  │   Ventas,    │
│   ...        │  │   etc.)      │
└──────────────┘  └──────────────┘
```

---

## ⚠️ Problema Potencial

Si `sessionStorage.getItem("logged")` devuelve `null` o `undefined`, entonces:
- `JSON.parse(null)` → `null`
- `JSON.parse(undefined)` → **ERROR**

Y si `logged.sesion.permisos` no existe o está vacío, el menú no se mostrará.

---

## ✅ Solución Recomendada

Crear una función helper para centralizar la lectura:

**Crear archivo:** `src/utils/sessionStorage.js`

```javascript
export const getLoggedUser = () => {
  try {
    const logged = sessionStorage.getItem("logged");
    if (!logged) return null;
    return JSON.parse(logged);
  } catch (error) {
    console.error("Error al parsear logged:", error);
    return null;
  }
};

export const getPermisos = () => {
  const logged = getLoggedUser();
  if (!logged || !logged.sesion) return [];
  
  const permisos = logged.sesion.permisos;
  if (Array.isArray(permisos)) return permisos;
  if (permisos) return [permisos];
  return [];
};
```

Y luego usar en todos los lugares:
```javascript
import { getPermisos } from "../../utils/sessionStorage";
const permisos = getPermisos();
```

---

**Fecha:** 2024  
**Total de lugares donde se lee:** 17  
**Total de lugares donde se escribe:** 1




