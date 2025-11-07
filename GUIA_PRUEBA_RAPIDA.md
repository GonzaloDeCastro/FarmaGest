# 🚀 Guía Rápida para Probar el Sistema de IA

## ⚡ Pasos Rápidos

### 1️⃣ Iniciar la Aplicación

Abre una terminal y ejecuta:

```bash
npm start
```

La aplicación debería abrirse automáticamente en `http://localhost:3000`

---

### 2️⃣ Iniciar Sesión

1. Ve a la página de login
2. Ingresa tus credenciales
3. Haz login

---

### 3️⃣ Ir al Módulo de Ventas

1. En el menú lateral, busca **"Ventas"**
2. Click en **"Ventas"**
3. Deberías ver la lista de ventas

---

### 4️⃣ Crear Nueva Factura

1. Busca el botón **"Nueva Factura"** (generalmente arriba a la derecha)
2. Click en **"Nueva Factura"**
3. Se abrirá un modal grande

---

### 5️⃣ Seleccionar un Cliente

1. En el modal, busca el campo **"Cliente"**
2. Click en el dropdown
3. **Selecciona cualquier cliente**

---

### 6️⃣ Ver las Recomendaciones IA ✨

**¡Aquí es donde aparece la magia!**

Después de seleccionar un cliente, deberías ver:

```
┌─────────────────────────────────────────┐
│ ✨ Recomendaciones IA        [Número]   │
├─────────────────────────────────────────┤
│                                         │
│ 📦 Basado en tu historial               │
│ [Tarjetas de productos recomendados]    │
│                                         │
│ 📈 Productos más vendidos               │
│ [Tarjetas de productos populares]       │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7️⃣ Probar Agregar un Producto

1. En la sección de recomendaciones, busca un producto
2. Click en el botón **"Agregar"** del producto
3. **¡El producto se agregará automáticamente a la tabla!**

---

## ✅ Qué Esperar Ver

### Si el cliente tiene historial:
- ✅ Sección "Basado en tu historial" con productos que compró antes
- ✅ Sección "Productos más vendidos" con productos populares
- ✅ Información de stock en cada producto

### Si el cliente es nuevo:
- ✅ Solo sección "Productos más vendidos"
- ✅ O mensaje "No hay recomendaciones disponibles"

---

## 🔍 Verificar que Funciona

### En la Consola del Navegador (F12):

1. Presiona **F12** para abrir las herramientas de desarrollador
2. Ve a la pestaña **"Console"**
3. Deberías ver:
   - ✅ Sin errores en rojo
   - ⚠️ Puede haber warnings (no son críticos)
   - ℹ️ Puede haber logs informativos

### Lo que NO deberías ver:
- ❌ Errores rojos críticos
- ❌ "Cannot read property..."
- ❌ "undefined is not a function"

---

## 🎯 Casos de Prueba Específicos

### Prueba 1: Cliente con Historial
1. Selecciona un cliente que haya comprado antes
2. **Resultado esperado:** Recomendaciones basadas en sus compras previas

### Prueba 2: Cliente Nuevo
1. Selecciona un cliente sin compras
2. **Resultado esperado:** Solo productos más vendidos

### Prueba 3: Agregar Producto
1. Click en "Agregar" de un producto recomendado
2. **Resultado esperado:** Producto aparece en la tabla de items

### Prueba 4: Productos Relacionados
1. Agrega un producto manualmente usando "Agregar Items"
2. **Resultado esperado:** Aparece sección "Productos relacionados"

---

## 🐛 Si Algo No Funciona

### Problema: No aparecen recomendaciones

**Solución:**
1. Verifica que hayas seleccionado un cliente
2. Verifica que haya productos en la base de datos
3. Abre la consola (F12) y revisa errores
4. Verifica que el backend esté corriendo

### Problema: Error en consola

**Solución:**
1. Copia el error completo
2. Verifica que todos los archivos estén guardados
3. Detén el servidor (Ctrl+C) y vuelve a iniciarlo
4. Limpia la caché del navegador (Ctrl+Shift+R)

### Problema: El componente no se muestra

**Solución:**
1. Verifica que el cliente esté seleccionado (no debe ser 0)
2. Verifica que haya productos cargados
3. Revisa la consola por errores de importación

---

## 📸 Qué Buscar Visualmente

### Diseño del Componente:
- **Fondo morado/púrpura** con gradiente
- **Icono ✨** animado en la parte superior
- **Tarjetas blancas** con productos
- **Botones azules** para agregar
- **Badges** de colores para stock

### Secciones:
1. **Header** con icono y título
2. **"Basado en tu historial"** (si aplica)
3. **"Productos más vendidos"** (siempre)
4. **"Productos relacionados"** (cuando hay items agregados)

---

## 🎉 ¡Listo para Probar!

Sigue estos pasos y deberías ver el sistema de IA funcionando. Si encuentras algún problema, revisa la consola del navegador o avísame y te ayudo a solucionarlo.

**¡Buena suerte con las pruebas! 🚀**

