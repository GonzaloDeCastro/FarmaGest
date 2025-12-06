# 🔧 Solución a Problemas del Menú y Permisos

## Problemas Identificados

### 1. Menú Desaparecido
**Causa:** Los permisos no se están cargando correctamente desde `sessionStorage`, resultando en un array vacío que oculta todas las opciones del menú.

### 2. Categorías No Aparecen
**Causa:** No se estaba llamando a `getCategoriasAPI()` en el componente `VentaForm`.

---

## Soluciones Aplicadas

### ✅ Solución 1: Mejora del Manejo de Permisos

**Archivo:** `src/shared/Layout.js`

**Cambios:**
- Validación más robusta de permisos
- Manejo de casos donde `permisos` puede ser `null`, `undefined`, o no ser un array
- Log de advertencia en desarrollo para ayudar a debuggear

**Código:**
```javascript
let permisos = [];
if (logged && logged.sesion) {
  permisos = Array.isArray(logged.sesion.permisos) 
    ? logged.sesion.permisos 
    : (logged.sesion.permisos ? [logged.sesion.permisos] : []);
}
```

### ✅ Solución 2: Carga de Categorías

**Archivo:** `src/components/Ventas/VentaForm.js`

**Cambios:**
- Agregado import de `getCategoriasAPI`
- Agregado dispatch de `getCategoriasAPI()` en el `useEffect`

---

## Verificación del Problema de Permisos

### Paso 1: Verificar sessionStorage

Abre la consola del navegador (F12) y ejecuta:

```javascript
JSON.parse(sessionStorage.getItem("logged"))
```

**Resultado esperado:**
```javascript
{
  sesion: {
    usuario_id: 1,
    correo: "admin@example.com",
    permisos: ["gestion_productos", "gestion_ventas", ...],
    // ... otros campos
  }
}
```

**Si no hay permisos:**
- El objeto `permisos` puede estar vacío `[]`
- El objeto `permisos` puede ser `null` o `undefined`
- El objeto `permisos` puede no existir

### Paso 2: Verificar Respuesta del Backend

El backend debe devolver los permisos en la respuesta del login. Verifica:

1. **Endpoint:** `GET /api/usuarios/login`
2. **Respuesta esperada:** Debe incluir un campo `permisos` con un array de strings

### Paso 3: Verificar Estructura de Datos

Si el backend devuelve los permisos en un formato diferente, puede ser necesario adaptar el código.

**Ejemplos de formatos posibles:**
```javascript
// Formato 1: Array directo
permisos: ["gestion_productos", "gestion_ventas"]

// Formato 2: String separado por comas
permisos: "gestion_productos,gestion_ventas"

// Formato 3: Objeto con permisos
permisos: { productos: true, ventas: true }
```

---

## Solución Temporal: Mostrar Menú Básico

Si los permisos no se están cargando, puedes agregar un menú básico temporalmente:

**En `Layout.js`, agregar después de la línea de permisos:**
```javascript
// Si no hay permisos pero hay un usuario logueado, mostrar menú básico
const mostrarMenuBasico = permisos.length === 0 && logged && logged.sesion;

if (mostrarMenuBasico) {
  // Mostrar opciones básicas
  permisos = [
    "gestion_productos",
    "gestion_ventas",
    "gestion_clientes"
  ];
}
```

**⚠️ Nota:** Esto es solo temporal para poder usar la aplicación. Debes corregir el problema de permisos en el backend.

---

## Verificación de Categorías

### Paso 1: Verificar que se Carguen

Abre la consola del navegador (F12) y ejecuta:

```javascript
// En el formulario de venta, verifica que las categorías estén cargadas
// En la consola del componente, deberías ver:
state.producto?.categoriasState
```

### Paso 2: Verificar Endpoint

El endpoint debe ser:
```
GET /api/productos/categorias
```

**Respuesta esperada:**
```javascript
[
  { categoria_id: 1, nombre: "Categoría 1" },
  { categoria_id: 2, nombre: "Categoría 2" },
  // ...
]
```

---

## Próximos Pasos

1. **Verificar el backend:**
   - Asegúrate de que el endpoint de login devuelva los permisos
   - Verifica el formato de los permisos

2. **Verificar sessionStorage:**
   - Después de hacer login, verifica que los permisos se guarden correctamente

3. **Recargar la aplicación:**
   - Recarga la página (F5)
   - Verifica que el menú aparezca

4. **Si el problema persiste:**
   - Revisa los logs de la consola
   - Verifica que el backend esté devolviendo los permisos correctamente
   - Considera usar la solución temporal mencionada arriba

---

## Comandos de Debug

### En la Consola del Navegador:

```javascript
// Ver qué hay en sessionStorage
console.log('Logged:', JSON.parse(sessionStorage.getItem("logged")));

// Ver permisos específicamente
console.log('Permisos:', JSON.parse(sessionStorage.getItem("logged"))?.sesion?.permisos);

// Ver categorías
// (Solo funciona si estás en un componente que usa Redux)
// Desde Redux DevTools o desde el componente
```

---

**Fecha:** 2024  
**Estado:** Correcciones aplicadas, requiere verificación del backend










