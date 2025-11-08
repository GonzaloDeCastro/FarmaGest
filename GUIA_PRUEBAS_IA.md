# 🧪 Guía de Pruebas - Sistema de IA de Recomendaciones

## 📋 Resumen

Esta guía explica cómo probar el sistema de recomendaciones IA implementado en el módulo de Ventas.

---

## ✅ Verificación Pre-requisitos

Antes de probar, verifica que:

1. ✅ El backend esté corriendo
2. ✅ Haya productos en la base de datos
3. ✅ Haya clientes registrados
4. ✅ Haya al menos algunas ventas históricas (opcional, pero recomendado)

---

## 🧪 Pruebas Manuales

### Test 1: Verificar que el componente se muestra

**Pasos:**
1. Inicia la aplicación: `npm start`
2. Inicia sesión en el sistema
3. Navega a **Ventas**
4. Click en **"Nueva Factura"**
5. Selecciona un cliente del dropdown

**Resultado esperado:**
- ✅ Debe aparecer una sección "Recomendaciones IA" con icono ✨
- ✅ Si el cliente tiene historial, deben aparecer recomendaciones
- ✅ Si el cliente no tiene historial, debe mostrar "No hay recomendaciones disponibles"

---

### Test 2: Recomendaciones basadas en historial

**Preparación:**
- Cliente debe tener al menos 1 venta previa
- La venta debe contener productos

**Pasos:**
1. Abre formulario de venta
2. Selecciona un cliente con historial de compras
3. Observa la sección "Basado en tu historial"

**Resultado esperado:**
- ✅ Debe mostrar productos que el cliente compró antes
- ✅ Los productos más comprados deben aparecer primero
- ✅ Debe mostrar la razón de la recomendación (ej: "Lo compraste 2 veces antes")

---

### Test 3: Productos más vendidos

**Pasos:**
1. Abre formulario de venta
2. Selecciona cualquier cliente
3. Observa la sección "Productos más vendidos"

**Resultado esperado:**
- ✅ Debe mostrar los top 5 productos más vendidos en general
- ✅ Debe mostrar cantidad de unidades vendidas
- ✅ No debe incluir productos ya agregados a la venta

---

### Test 4: Productos relacionados

**Pasos:**
1. Abre formulario de venta
2. Selecciona un cliente
3. Agrega un producto a la venta usando "Agregar Items"
4. Observa la sección "Productos relacionados"

**Resultado esperado:**
- ✅ Debe mostrar productos de la misma categoría
- ✅ No debe incluir el producto ya agregado
- ✅ Debe aparecer solo si hay items agregados

---

### Test 5: Agregar producto desde recomendaciones

**Pasos:**
1. Abre formulario de venta
2. Selecciona un cliente
3. En la sección de recomendaciones, click en "Agregar" de un producto

**Resultado esperado:**
- ✅ El producto debe agregarse automáticamente a la tabla de items
- ✅ Debe calcularse el total correctamente
- ✅ El producto debe desaparecer de las recomendaciones (o marcarse como agregado)

---

### Test 6: Exclusión de productos sin stock

**Pasos:**
1. Abre formulario de venta
2. Selecciona un cliente
3. Observa las recomendaciones

**Resultado esperado:**
- ✅ Productos con stock 0 no deben aparecer
- ✅ O deben aparecer deshabilitados con badge "Sin stock"

---

### Test 7: Cliente sin historial

**Pasos:**
1. Abre formulario de venta
2. Selecciona un cliente nuevo (sin ventas previas)

**Resultado esperado:**
- ✅ Debe mostrar solo "Productos más vendidos"
- ✅ No debe mostrar "Basado en tu historial"
- ✅ O debe mostrar mensaje "No hay recomendaciones disponibles"

---

### Test 8: Performance con muchos datos

**Pasos:**
1. Abre formulario de venta
2. Selecciona un cliente con muchas ventas históricas (100+)
3. Observa el tiempo de carga

**Resultado esperado:**
- ✅ Las recomendaciones deben aparecer en menos de 2 segundos
- ✅ No debe congelar la interfaz
- ✅ Debe mostrar las recomendaciones correctamente

---

## 🔍 Verificación en Consola

Abre la consola del navegador (F12) y verifica:

### Sin errores en consola
- ✅ No debe haber errores de JavaScript
- ✅ Solo warnings menores (si los hay)

### Logs de debug (opcional)
Si agregaste logs, verifica:
```javascript
// En RecommendationService.js puedes agregar:
console.log('Recomendaciones generadas:', recommendations);
```

---

## 🐛 Casos de Error a Probar

### Error 1: Backend no responde
**Acción:** Apaga el backend
**Resultado esperado:**
- ✅ El sistema debe funcionar con ventas del store como fallback
- ✅ No debe romperse la aplicación
- ✅ Debe mostrar recomendaciones basadas en datos disponibles

### Error 2: Cliente sin ID
**Acción:** Selecciona cliente pero clienteId es null
**Resultado esperado:**
- ✅ No debe mostrar recomendaciones
- ✅ No debe generar errores

### Error 3: Productos vacíos
**Acción:** Base de datos sin productos
**Resultado esperado:**
- ✅ Debe mostrar mensaje "No hay recomendaciones disponibles"
- ✅ No debe generar errores

---

## 📊 Datos de Prueba Recomendados

### Cliente de prueba ideal:
- **ID:** 1
- **Ventas previas:** Al menos 3-5 ventas
- **Productos comprados:** Varios productos diferentes
- **Categorías:** Al menos 2 categorías diferentes

### Productos de prueba:
- Al menos 10 productos diferentes
- Varias categorías
- Algunos con stock, otros sin stock
- Diferentes marcas

---

## ✅ Checklist de Pruebas

- [ ] Componente se muestra correctamente
- [ ] Recomendaciones basadas en historial funcionan
- [ ] Productos más vendidos se muestran
- [ ] Productos relacionados funcionan
- [ ] Agregar producto desde recomendaciones funciona
- [ ] Productos sin stock se excluyen
- [ ] Cliente sin historial maneja correctamente
- [ ] Performance es aceptable
- [ ] No hay errores en consola
- [ ] Manejo de errores funciona

---

## 🚀 Pruebas Automatizadas

Se ha creado un archivo de tests unitarios:

**Ubicación:** `src/services/ai/__tests__/RecommendationService.test.js`

**Para ejecutar:**
```bash
npm test RecommendationService
```

**Tests incluidos:**
- ✅ Test de recomendaciones por historial
- ✅ Test de productos más vendidos
- ✅ Test de productos relacionados
- ✅ Test de exclusión de productos agregados
- ✅ Test de casos edge (sin datos, etc.)

---

## 📝 Notas Importantes

1. **Endpoint del Backend:**
   - El sistema intenta usar: `GET /api/ventas/cliente/:clienteId`
   - Si no existe, usa ventas generales del store como fallback
   - Para mejor experiencia, implementa el endpoint en el backend

2. **Estructura de Datos:**
   - El sistema maneja diferentes estructuras:
     - `venta.items` o `venta.itemsAgregados`
     - `item.producto_id` o `item.productoId`

3. **Performance:**
   - Optimizado para hasta 1000 productos
   - Hasta 10000 ventas históricas
   - Si tienes más datos, considera paginación

---

## 🎯 Resultado Final Esperado

Al completar todas las pruebas, deberías ver:

✅ **Sistema funcionando correctamente**
✅ **Recomendaciones relevantes y útiles**
✅ **UI atractiva y funcional**
✅ **Sin errores ni bugs**
✅ **Performance aceptable**

---

## 📞 Troubleshooting

### Problema: No aparecen recomendaciones
**Solución:**
- Verifica que haya productos en la base de datos
- Verifica que el cliente tenga ventas previas
- Revisa la consola del navegador por errores

### Problema: Recomendaciones incorrectas
**Solución:**
- Verifica la estructura de datos de ventas
- Revisa que los productos tengan categoria_id y Marca
- Verifica que los items de ventas tengan producto_id

### Problema: Performance lenta
**Solución:**
- Considera limitar la cantidad de ventas históricas
- Implementa paginación en el backend
- Cachea recomendaciones por cliente

---

**Fecha de creación:** 2024  
**Versión:** 1.0




