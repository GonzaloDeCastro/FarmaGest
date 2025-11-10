# 🎯 Oportunidades de Patrones de Diseño en FarmaGest

Este documento identifica oportunidades para aplicar patrones de diseño adicionales y propone implementaciones concretas.

---

## 📋 Tabla de Contenidos

1. [Strategy Pattern - Estrategias de Visualización y Exportación](#1-strategy-pattern)
2. [Builder Pattern - Construcción de Objetos Complejos](#2-builder-pattern)
3. [Adapter Pattern - Transformación de Datos](#3-adapter-pattern)
4. [Template Method - Estructura Común en Slices](#4-template-method)
5. [Chain of Responsibility - Validación de Permisos](#5-chain-of-responsibility)
6. [Decorator Pattern - Validaciones de Formularios](#6-decorator-pattern)

---

## 1. Strategy Pattern

### 🎯 Oportunidad Identificada

**Ubicación actual**: `src/components/Reportes/Reportes.js`

**Problema**: Lógica condicional para diferentes tipos de visualización (Tabla vs Gráfico, Montos vs Cantidad de Ventas) y exportación a Excel con diferentes formatos.

**Solución**: Implementar Strategy Pattern para encapsular cada algoritmo de visualización/exportación.

### 📝 Implementación Propuesta

#### 1.1. Estrategias de Visualización

```javascript
// src/patterns/strategies/VisualizationStrategy.js

// Estrategia base
class VisualizationStrategy {
  render(data) {
    throw new Error("Método render debe ser implementado");
  }
}

// Estrategia: Tabla
class TableVisualizationStrategy extends VisualizationStrategy {
  render(data) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.headerTable}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cantidad de Ventas</th>
              <th>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((reporte, index) => (
                <tr key={index}>
                  <td>{reporte.fecha.slice(0, 10)}</td>
                  <td>{reporte.cantidad_ventas}</td>
                  <td>${reporte.monto_total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.noData}>
                  No hay ventas en este rango de fecha
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

// Estrategia: Gráfico de Montos
class AmountChartStrategy extends VisualizationStrategy {
  constructor(maxMonto) {
    super();
    this.maxMonto = maxMonto;
  }

  render(data) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.bars}>
          {data.map((item, index) => (
            <div key={index} className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{ height: `${(item.monto / this.maxMonto) * 100}%` }}
              >
                <span className={styles.barLabel}>
                  ${item.monto.toLocaleString()}
                </span>
              </div>
              <div className={styles.label}>{item.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// Estrategia: Gráfico de Cantidad de Ventas
class QuantityChartStrategy extends VisualizationStrategy {
  constructor(maxCantidadVentas) {
    super();
    this.maxCantidadVentas = maxCantidadVentas;
  }

  render(data) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.bars}>
          {data.map((item, index) => (
            <div key={index} className={styles.barWrapper}>
              <div
                className={styles.barCantidad}
                style={{
                  height: `${(item.cantidad_ventas / this.maxCantidadVentas) * 100}%`,
                }}
              >
                <span className={styles.barLabel}>
                  {item.cantidad_ventas.toLocaleString()}
                </span>
              </div>
              <div className={styles.label}>{item.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// Factory para crear estrategias
class VisualizationStrategyFactory {
  static createStrategy(type, data) {
    const maxMonto = Math.max(...data.map((item) => item.monto));
    const maxCantidadVentas = Math.max(...data.map((item) => item.cantidad_ventas));

    switch (type) {
      case "table":
        return new TableVisualizationStrategy();
      case "amount-chart":
        return new AmountChartStrategy(maxMonto);
      case "quantity-chart":
        return new QuantityChartStrategy(maxCantidadVentas);
      default:
        return new TableVisualizationStrategy();
    }
  }
}

export { VisualizationStrategyFactory, VisualizationStrategy };
```

#### 1.2. Estrategias de Exportación

```javascript
// src/patterns/strategies/ExportStrategy.js

// Estrategia base
class ExportStrategy {
  export(data, fileName) {
    throw new Error("Método export debe ser implementado");
  }

  generateFileName(baseName, dateFrom, dateTo) {
    if (dateFrom && dateTo) {
      return `${baseName}-desde-${dateFrom}-hasta-${dateTo}`;
    } else if (dateFrom) {
      return `${baseName}-desde-${dateFrom}`;
    } else if (dateTo) {
      return `${baseName}-hasta-${dateTo}`;
    }
    return `${baseName}-sin-fecha-seleccionada`;
  }
}

// Estrategia: Exportar a Excel
class ExcelExportStrategy extends ExportStrategy {
  export(data, fileName) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}

// Estrategia: Exportar a PDF (futuro)
class PDFExportStrategy extends ExportStrategy {
  export(data, fileName) {
    // Implementación futura con jsPDF
    console.log("Exportando a PDF:", data, fileName);
  }
}

// Estrategia: Exportar a CSV (futuro)
class CSVExportStrategy extends ExportStrategy {
  export(data, fileName) {
    // Implementación futura
    console.log("Exportando a CSV:", data, fileName);
  }
}

export { ExcelExportStrategy, PDFExportStrategy, CSVExportStrategy };
```

#### 1.3. Uso en Componente Reportes

```javascript
// Modificación en src/components/Reportes/Reportes.js

import { VisualizationStrategyFactory } from "../../patterns/strategies/VisualizationStrategy";
import { ExcelExportStrategy } from "../../patterns/strategies/ExportStrategy";

const Reportes = () => {
  const [visualizationType, setVisualizationType] = useState("table");
  const [chartType, setChartType] = useState("amount"); // 'amount' o 'quantity'
  const exportStrategy = new ExcelExportStrategy();

  // ... código existente ...

  const handleExportExcel = (data, fileName) => {
    const finalFileName = exportStrategy.generateFileName(
      fileName,
      dateSelectedFrom,
      dateSelectedTo
    );

    Swal.fire({
      title: "Exportar a Excel",
      html: `¿Quieres exportar los datos a un archivo Excel?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, exportar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        exportStrategy.export(data, finalFileName);
        Swal.fire({
          title: "Exportación completada",
          text: `El archivo "${finalFileName}.xlsx" ha sido descargado.`,
          icon: "success",
        });
      }
    });
  };

  // Determinar tipo de visualización
  const getVisualizationType = () => {
    if (!grafico) return "table";
    return chartType === "amount" ? "amount-chart" : "quantity-chart";
  };

  // Renderizar con estrategia
  const visualizationStrategy = VisualizationStrategyFactory.createStrategy(
    getVisualizationType(),
    data
  );

  return (
    <div className={styles.containerSelected}>
      {/* ... código existente de controles ... */}
      
      {/* Renderizar según estrategia */}
      {visualizationStrategy.render(data)}
    </div>
  );
};
```

---

## 2. Builder Pattern

### 🎯 Oportunidad Identificada

**Ubicación actual**: `src/components/Ventas/VentaForm.js`, `src/redux/productosSlice.js`

**Problema**: Construcción compleja de objetos `ventaData` y `productoData` con múltiples campos, transformaciones y valores por defecto.

**Solución**: Implementar Builder Pattern para construir objetos paso a paso.

### 📝 Implementación Propuesta

```javascript
// src/patterns/builders/VentaBuilder.js

class VentaBuilder {
  constructor() {
    this.venta = {
      itemsAgregados: [],
      totalConDescuento: 0,
      totalSinDescuento: 0,
      descuento: 0,
      fecha_hora: new Date().toISOString().slice(0, 16),
    };
  }

  setCliente(clienteId) {
    this.venta.cliente_id = clienteId;
    return this;
  }

  setItems(items) {
    this.venta.itemsAgregados = items;
    return this;
  }

  addItem(item) {
    this.venta.itemsAgregados.push(item);
    return this;
  }

  setObraSocial(obraSocial) {
    if (obraSocial && obraSocial.Descuento !== undefined) {
      this.venta.descuento = obraSocial.Descuento * 100;
    }
    return this;
  }

  calculateTotal() {
    const total = this.venta.itemsAgregados.reduce(
      (sum, item) => sum + parseFloat(item.total || 0),
      0
    );
    this.venta.totalSinDescuento = total.toFixed(2);
    return this;
  }

  applyDescuento() {
    const descuento = this.venta.descuento / 100;
    const totalConDescuento = (
      parseFloat(this.venta.totalSinDescuento) * (1 - descuento)
    ).toFixed(2);
    this.venta.totalConDescuento = totalConDescuento;
    return this;
  }

  setUsuario(usuarioId) {
    this.venta.usuario_id = usuarioId;
    return this;
  }

  setNumeroFactura(numero) {
    this.venta.numero_factura = numero;
    return this;
  }

  setFechaHora(fechaHora) {
    this.venta.fecha_hora = fechaHora;
    return this;
  }

  build() {
    // Validaciones antes de construir
    if (!this.venta.cliente_id) {
      throw new Error("Cliente es requerido");
    }
    if (!this.venta.itemsAgregados || this.venta.itemsAgregados.length === 0) {
      throw new Error("Debe agregar al menos un item");
    }
    if (!this.venta.usuario_id) {
      throw new Error("Usuario es requerido");
    }

    return { ...this.venta };
  }
}

export default VentaBuilder;
```

#### 2.1. Uso en VentaFormModal

```javascript
// Modificación en src/components/Ventas/VentaForm.js

import VentaBuilder from "../../patterns/builders/VentaBuilder";

const VentaFormModal = ({ usuarioId }) => {
  // ... código existente ...

  const handleCrearFactura = () => {
    try {
      const ventaData = new VentaBuilder()
        .setCliente(cliente)
        .setItems(itemsAgregados)
        .setObraSocial(obraSocial)
        .calculateTotal()
        .applyDescuento()
        .setUsuario(usuarioId)
        .setNumeroFactura(ultimaVenta && ultimaVenta?.venta_id + 1)
        .setFechaHora(dateSelectedFrom)
        .build();

      dispatch(addVentaAPI(ventaData));
      handleClose();
      setCliente(0);
      setItemsAgregados([]);
      setDateSelectedFrom(formattedToday);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: error.message,
      });
    }
  };

  // ... resto del código ...
};
```

#### 2.2. Builder para Productos

```javascript
// src/patterns/builders/ProductoBuilder.js

class ProductoBuilder {
  constructor() {
    this.producto = {};
  }

  setNombre(nombre) {
    this.producto.nombre = nombre;
    return this;
  }

  setCodigo(codigo) {
    this.producto.codigo = codigo;
    return this;
  }

  setMarca(marca) {
    this.producto.marca = marca;
    return this;
  }

  setCategoria(categoriaId, categoriaDesc) {
    this.producto.categoria_id = categoriaId === 0 ? null : categoriaId;
    this.producto.Categoria = categoriaDesc;
    return this;
  }

  setPrecio(precio) {
    this.producto.precio = parseFloat(precio);
    return this;
  }

  setStock(stock) {
    this.producto.stock = parseInt(stock);
    return this;
  }

  setUsuario(usuarioId) {
    this.producto.usuario_id = usuarioId;
    return this;
  }

  build() {
    // Validaciones
    if (!this.producto.nombre) {
      throw new Error("Nombre es requerido");
    }
    if (!this.producto.codigo) {
      throw new Error("Código es requerido");
    }
    if (!this.producto.precio || this.producto.precio <= 0) {
      throw new Error("Precio debe ser mayor a 0");
    }

    return { ...this.producto };
  }
}

export default ProductoBuilder;
```

---

## 3. Adapter Pattern

### 🎯 Oportunidad Identificada

**Ubicación actual**: `src/redux/productosSlice.js` (líneas 103-112, 168-177), todos los slices

**Problema**: Transformaciones repetitivas entre formato del backend y formato del frontend. Mapeos manuales de datos.

**Solución**: Crear adapters que transformen datos entre formatos.

### 📝 Implementación Propuesta

```javascript
// src/patterns/adapters/ProductoAdapter.js

class ProductoAdapter {
  // Adaptar datos del formulario al formato del backend
  static toBackendFormat(formData, usuarioId) {
    return {
      nombre: formData.productoNombre,
      codigo: formData.codigo,
      marca: formData.marca,
      categoria_id: formData.categoriaID === 0 ? null : formData.categoriaID,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.cantidad),
      usuario_id: usuarioId,
    };
  }

  // Adaptar respuesta del backend al formato del frontend
  static toFrontendFormat(backendResponse, formData) {
    return {
      producto_id: backendResponse.producto_id,
      Nombre: formData.productoNombre,
      Codigo: formData.codigo,
      Marca: formData.marca,
      Categoria: formData.categoriaDesc,
      categoria_id: formData.categoriaID === 0 ? null : formData.categoriaID,
      Stock: parseInt(formData.cantidad),
      Precio: parseFloat(formData.precio),
    };
  }

  // Adaptar datos para edición
  static toEditFormat(backendData) {
    return {
      productoNombre: backendData.Nombre,
      codigo: backendData.Codigo,
      marca: backendData.Marca,
      categoriaID: backendData.categoria_id || 0,
      categoriaDesc: backendData.Categoria,
      precio: backendData.Precio,
      cantidad: backendData.Stock,
    };
  }
}

export default ProductoAdapter;
```

#### 3.1. Uso en ProductForm

```javascript
// Modificación en src/components/Productos/ProductForm.js

import ProductoAdapter from "../../patterns/adapters/ProductoAdapter";

const ProductFormModal = ({ Categorias, usuarioId }) => {
  // ... código existente ...

  const handleAddProduct = (data) => {
    try {
      const backendData = ProductoAdapter.toBackendFormat(data, usuarioId);
      
      dispatch(
        addProductoAPI(backendData, (response) => {
          // Callback para transformar respuesta
          const frontendData = ProductoAdapter.toFrontendFormat(response, data);
          return frontendData;
        })
      );
      
      handleClose();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  // ... resto del código ...
};
```

#### 3.2. Adapter Genérico para React Select

```javascript
// src/patterns/adapters/SelectAdapter.js

class SelectAdapter {
  // Adaptar array de objetos a formato de react-select
  static toSelectOptions(data, valueKey, labelKey, labelFormatter = null) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item) => ({
      value: item[valueKey],
      label: labelFormatter 
        ? labelFormatter(item) 
        : item[labelKey],
    }));
  }

  // Adaptar cliente para select
  static clienteToSelectOptions(clientes) {
    return this.toSelectOptions(
      clientes?.initialState || [],
      "cliente_id",
      "DNI",
      (cliente) => `${cliente.DNI} - ${cliente.Apellido} ${cliente.Nombre}`
    );
  }

  // Adaptar productos para select
  static productoToSelectOptions(productos) {
    return this.toSelectOptions(
      productos?.initialState || [],
      "producto_id",
      "Nombre"
    );
  }
}

export default SelectAdapter;
```

---

## 4. Template Method

### 🎯 Oportunidad Identificada

**Ubicación actual**: Todos los `*Slice.js` en `src/redux/`

**Problema**: Estructura repetitiva en todos los slices (mismos reducers, mismas operaciones CRUD, mismos patrones de error handling).

**Solución**: Crear una clase base con Template Method que defina el esqueleto de operaciones.

### 📝 Implementación Propuesta

```javascript
// src/patterns/templates/BaseSliceTemplate.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

class BaseSliceTemplate {
  constructor(name, initialState, apiEndpoint) {
    this.name = name;
    this.initialState = initialState;
    this.apiEndpoint = apiEndpoint;
    this.slice = this.createSlice();
  }

  // Template Method: Define el esqueleto del slice
  createSlice() {
    return createSlice({
      name: this.name,
      initialState: this.initialState,
      reducers: this.getReducers(),
    });
  }

  // Métodos que deben ser implementados por subclases
  getReducers() {
    return {
      // Métodos comunes que pueden ser sobrescritos
      getItems: (state, action) => ({
        ...state,
        initialState: action.payload,
      }),
      addItem: (state, action) => ({
        ...state,
        initialState: [action.payload, ...state.initialState],
      }),
      deleteItem: (state, action) => ({
        ...state,
        initialState: state.initialState.filter(
          (item) => item[this.getIdKey()] !== action.payload
        ),
      }),
      editItem: (state, action) => ({
        ...state,
        initialState: state.initialState.map((item) =>
          item[this.getIdKey()] === action.payload[this.getIdKey()]
            ? action.payload
            : item
        ),
      }),
    };
  }

  // Métodos abstractos (deben ser implementados)
  getIdKey() {
    throw new Error("getIdKey debe ser implementado");
  }

  // Template Method para operaciones API
  createGetItemsAPI(params = {}) {
    return () => {
      return async (dispatch) => {
        try {
          const response = await axios.get(this.apiEndpoint, { params });
          if (response.status === 200) {
            dispatch(this.slice.actions.getItems(response.data));
          }
        } catch (error) {
          this.handleError(error, "Error al obtener items");
        }
      };
    };
  }

  createAddItemAPI(transformResponse = null) {
    return (itemData) => {
      return async (dispatch) => {
        try {
          const response = await axios.post(this.apiEndpoint, itemData);
          if (response.status === 201) {
            const newItem = transformResponse
              ? transformResponse(response.data, itemData)
              : { ...itemData, [this.getIdKey()]: response.data[this.getIdKey()] };
            
            dispatch(this.slice.actions.addItem(newItem));
            this.showSuccessMessage("Item agregado correctamente");
          }
        } catch (error) {
          this.handleError(error, "Error al agregar item");
        }
      };
    };
  }

  // Hook para manejo de errores (puede ser sobrescrito)
  handleError(error, defaultMessage) {
    console.error(defaultMessage, error);
    
    if (error.response?.status === 409) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia!",
        text: error.response.data.mensaje || defaultMessage,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.mensaje || defaultMessage,
      });
    }
  }

  // Hook para mensajes de éxito (puede ser sobrescrito)
  showSuccessMessage(message) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: message,
    });
  }

  getReducer() {
    return this.slice.reducer;
  }

  getActions() {
    return this.slice.actions;
  }
}

export default BaseSliceTemplate;
```

#### 4.1. Uso: ProductoSlice Extendido

```javascript
// src/redux/productosSlice.js (refactorizado)

import BaseSliceTemplate from "../patterns/templates/BaseSliceTemplate";
import API from "../config";

class ProductoSlice extends BaseSliceTemplate {
  constructor() {
    super(
      "producto",
      {
        initialState: {},
        categoriasState: {},
      },
      `${API}/productos`
    );
  }

  getIdKey() {
    return "producto_id";
  }

  // Sobrescribir reducers para agregar categorías
  getReducers() {
    return {
      ...super.getReducers(),
      getCategorias: (state, action) => ({
        ...state,
        categoriasState: action.payload,
      }),
    };
  }

  // Agregar método específico para categorías
  getCategoriasAPI() {
    return () => {
      return async (dispatch) => {
        try {
          const response = await axios.get(`${API}/productos/categorias`);
          if (response.status === 200) {
            dispatch(this.slice.actions.getCategorias(response.data));
          }
        } catch (error) {
          this.handleError(error, "Error al obtener categorías");
        }
      };
    };
  }
}

const productoSlice = new ProductoSlice();

export const {
  getProductos,
  getCategorias,
  addProducto,
  deleteProducto,
  editProducto,
} = productoSlice.getActions();

export const getProductosAPI = productoSlice.createGetItemsAPI();
export const getCategoriasAPI = productoSlice.getCategoriasAPI();
export const addProductoAPI = productoSlice.createAddItemAPI((response, itemData) => ({
  producto_id: response.producto_id,
  Nombre: itemData.nombre,
  Codigo: itemData.codigo,
  Marca: itemData.marca,
  Categoria: itemData.Categoria,
  categoria_id: itemData.categoria_id,
  Stock: itemData.stock,
  Precio: itemData.precio,
}));

export default productoSlice.getReducer();
```

---

## 5. Chain of Responsibility

### 🎯 Oportunidad Identificada

**Ubicación actual**: `src/routes/PrivateRoute.js`, `src/routes/PrivateUsuarios.js`, etc.

**Problema**: Validaciones de permisos anidadas y repetitivas. Cada ruta privada verifica permisos de forma similar.

**Solución**: Implementar Chain of Responsibility para validar permisos en cascada.

### 📝 Implementación Propuesta

```javascript
// src/patterns/chain/AuthorizationHandler.js

class AuthorizationHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handle(logged) {
    if (this.nextHandler) {
      return this.nextHandler.handle(logged);
    }
    return { authorized: false, reason: "No handler available" };
  }
}

// Handler: Verificar si está autenticado
class AuthenticationHandler extends AuthorizationHandler {
  handle(logged) {
    if (!logged || logged === null) {
      return { authorized: false, reason: "No autenticado", redirect: "/login" };
    }
    return super.handle(logged);
  }
}

// Handler: Verificar permiso específico
class PermissionHandler extends AuthorizationHandler {
  constructor(requiredPermission) {
    super();
    this.requiredPermission = requiredPermission;
  }

  handle(logged) {
    if (!logged.sesion?.permisos?.includes(this.requiredPermission)) {
      return {
        authorized: false,
        reason: `Permiso requerido: ${this.requiredPermission}`,
        redirect: "/",
      };
    }
    return super.handle(logged);
  }
}

// Handler: Verificar rol específico
class RoleHandler extends AuthorizationHandler {
  constructor(requiredRoleId) {
    super();
    this.requiredRoleId = requiredRoleId;
  }

  handle(logged) {
    if (logged.sesion?.rol_id !== this.requiredRoleId) {
      return {
        authorized: false,
        reason: `Rol requerido: ${this.requiredRoleId}`,
        redirect: "/",
      };
    }
    return super.handle(logged);
  }
}

export { AuthenticationHandler, PermissionHandler, RoleHandler };
```

#### 5.1. Uso en Rutas Privadas

```javascript
// Modificación en src/routes/PrivateUsuarios.js

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AuthenticationHandler,
  PermissionHandler,
} from "../patterns/chain/AuthorizationHandler";

const PrivateRouteUsuarios = ({ redirect = "/" }) => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  // Construir cadena de responsabilidad
  const authChain = new AuthenticationHandler();
  authChain.setNext(new PermissionHandler("gestion_usuarios"));

  const result = authChain.handle(logged);

  if (result.authorized) {
    return <Outlet context={{ logged }} />;
  } else {
    if (result.reason.includes("Permiso")) {
      Swal.fire({
        icon: "warning",
        title: "Permiso denegado",
        text: "Necesita rol administrador para acceder a este módulo",
      });
    }
    return <Navigate to={result.redirect || redirect} replace />;
  }
};

export default PrivateRouteUsuarios;
```

---

## 6. Decorator Pattern

### 🎯 Oportunidad Identificada

**Ubicación actual**: Todos los formularios que usan `react-hook-form`

**Problema**: Validaciones repetitivas en cada campo. Misma lógica de validación duplicada.

**Solución**: Crear decoradores de validación que añadan reglas de validación de forma composable.

### 📝 Implementación Propuesta

```javascript
// src/patterns/decorators/ValidationDecorators.js

// Decorador base
class ValidationDecorator {
  constructor(validator) {
    this.validator = validator;
  }

  validate(value) {
    return this.validator(value);
  }
}

// Decoradores específicos
class RequiredDecorator extends ValidationDecorator {
  validate(value) {
    if (!value || value.toString().trim() === "") {
      return { valid: false, message: "Este campo es requerido" };
    }
    return { valid: true };
  }
}

class EmailDecorator extends ValidationDecorator {
  validate(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: "Email inválido" };
    }
    return { valid: true };
  }
}

class MinLengthDecorator extends ValidationDecorator {
  constructor(minLength) {
    super();
    this.minLength = minLength;
  }

  validate(value) {
    if (value && value.toString().length < this.minLength) {
      return {
        valid: false,
        message: `Debe tener al menos ${this.minLength} caracteres`,
      };
    }
    return { valid: true };
  }
}

class NumberDecorator extends ValidationDecorator {
  validate(value) {
    if (isNaN(value) || parseFloat(value) <= 0) {
      return { valid: false, message: "Debe ser un número mayor a 0" };
    }
    return { valid: true };
  }
}

// Factory para crear validaciones compuestas
class ValidationFactory {
  static createValidation(...decorators) {
    return (value) => {
      for (const decorator of decorators) {
        const result = decorator.validate(value);
        if (!result.valid) {
          return result;
        }
      }
      return { valid: true };
    };
  }

  // Validaciones predefinidas
  static required() {
    return new RequiredDecorator();
  }

  static email() {
    return new EmailDecorator();
  }

  static minLength(length) {
    return new MinLengthDecorator(length);
  }

  static number() {
    return new NumberDecorator();
  }

  // Combinaciones comunes
  static requiredEmail() {
    return this.createValidation(this.required(), this.email());
  }

  static requiredNumber() {
    return this.createValidation(this.required(), this.number());
  }

  static requiredMinLength(length) {
    return this.createValidation(this.required(), this.minLength(length));
  }
}

export { ValidationFactory };
```

#### 6.1. Uso en Formularios

```javascript
// Modificación en src/components/Productos/ProductForm.js

import { ValidationFactory } from "../../patterns/decorators/ValidationDecorators";

const ProductFormModal = ({ Categorias, usuarioId }) => {
  // ... código existente ...

  // Crear validaciones usando decoradores
  const validations = {
    productoNombre: ValidationFactory.createValidation(
      ValidationFactory.required(),
      ValidationFactory.minLength(3)
    ),
    codigo: ValidationFactory.required(),
    marca: ValidationFactory.required(),
    precio: ValidationFactory.requiredNumber(),
    cantidad: ValidationFactory.requiredNumber(),
    categoriaID: ValidationFactory.required(),
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: async (data) => {
      const errors = {};
      
      Object.keys(validations).forEach((field) => {
        const validation = validations[field];
        const result = validation(data[field]);
        if (!result.valid) {
          errors[field] = { message: result.message };
        }
      });

      return {
        values: Object.keys(errors).length === 0 ? data : {},
        errors,
      };
    },
  });

  // ... resto del código ...
};
```

---

## 📊 Resumen de Beneficios

| Patrón | Beneficio Principal | Complejidad de Implementación |
|--------|---------------------|-------------------------------|
| **Strategy** | Facilita agregar nuevos tipos de visualización/exportación | Media |
| **Builder** | Construcción clara y validada de objetos complejos | Baja |
| **Adapter** | Elimina duplicación en transformaciones de datos | Baja |
| **Template Method** | Reduce código duplicado en slices | Media-Alta |
| **Chain of Responsibility** | Permisos modulares y extensibles | Media |
| **Decorator** | Validaciones reutilizables y composables | Baja |

---

## 🚀 Próximos Pasos

1. **Implementar Strategy Pattern** en Reportes (mayor impacto visual)
2. **Implementar Builder Pattern** en VentaForm (mejora UX y validaciones)
3. **Implementar Adapter Pattern** en todos los slices (reducción de duplicación)
4. Evaluar necesidad de Template Method según escala del proyecto
5. Implementar Chain of Responsibility si se agregan más permisos
6. Considerar Decorator Pattern si se agregan más validaciones complejas

---

## 📝 Notas

- Estos patrones son **opcionales** y deben evaluarse según las necesidades del proyecto
- Algunos patrones pueden ser "over-engineering" para proyectos pequeños
- Se recomienda implementar gradualmente y medir impacto
- Los patrones actuales (Observer, Singleton, Facade, Proxy) ya están bien implementados





