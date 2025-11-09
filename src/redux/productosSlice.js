/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const initialState = {
  productos: [], // Lista de productos en memoria
  categoriasState: [],
  filtrosState: {
    marcas: [],
    proveedores: [],
  },
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const productoDataSlice = createSlice({
  name: "producto",
  initialState,
  reducers: {
    getProductos: (state, action) => {
      const data = action.payload;
      const productosRaw = Array.isArray(data)
        ? data
        : Array.isArray(data?.productos)
        ? data.productos
        : [];

      const adaptProducto = (producto = {}) => {
        const categoriaNormalizada =
          producto.Categoria ??
          producto.categoria ??
          producto.categoria_nombre ??
          producto.categoria_descripcion ??
          "";

        return {
          producto_id: producto.producto_id ?? producto.Producto_id ?? null,
          Nombre: producto.Nombre ?? producto.nombre ?? "",
          Codigo: producto.Codigo ?? producto.codigo ?? "",
          Marca: producto.Marca ?? producto.marca ?? "",
          Categoria: categoriaNormalizada,
          categoria: categoriaNormalizada,
          categoria_id: producto.categoria_id ?? null,
          Stock: Number(
            producto.Stock ?? producto.stock ?? producto.cantidad ?? 0
          ),
          Precio: Number(producto.Precio ?? producto.precio ?? 0),
          proveedor_id: producto.proveedor_id ?? null,
          Proveedor: producto.proveedor ?? producto.Proveedor ?? "",
          FechaCreacion:
            producto.FechaCreacion ??
            producto.fechaCreacion ??
            producto.created_at ??
            "",
        };
      };

      const productos = productosRaw.map(adaptProducto);

      const total =
        typeof data?.total === "number" ? data.total : productos.length;
      const page = typeof data?.page === "number" ? data.page : state.page || 1;
      const pageSize =
        typeof data?.pageSize === "number"
          ? data.pageSize
          : state.pageSize || productos.length || 10;
      const totalPages =
        typeof data?.totalPages === "number"
          ? data.totalPages
          : state.totalPages || 1;

      return {
        ...state,
        productos,
        total,
        page,
        pageSize,
        totalPages,
      };
    },
    getCategorias: (state, action) => {
      return {
        ...state,
        categoriasState: Array.isArray(action.payload) ? action.payload : [],
      };
    },
    setFiltros: (state, action) => {
      const filtros = action.payload || {};
      state.filtrosState = {
        marcas: Array.isArray(filtros.marcas) ? filtros.marcas : [],
        proveedores: Array.isArray(filtros.proveedores)
          ? filtros.proveedores
          : [],
      };
    },
    addProducto: (state, action) => {
      // Asegurar que productos sea un array
      const currentProductos = Array.isArray(state.productos)
        ? state.productos
        : [];

      return {
        ...state,
        productos: [action.payload, ...currentProductos],
        total: (state.total || currentProductos.length) + 1,
      };
    },

    deleteProducto: (state, action) => {
      // Asegurar que productos sea un array
      const currentProductos = Array.isArray(state.productos)
        ? state.productos
        : [];

      return {
        ...state,
        productos: currentProductos.filter(
          (productoData) => productoData?.producto_id !== action?.payload
        ),
        total: Math.max((state.total || currentProductos.length) - 1, 0),
      };
    },
    editProducto: (state, action) => {
      // Asegurar que productos sea un array
      const currentProductos = Array.isArray(state.productos)
        ? state.productos
        : [];

      return {
        ...state,
        productos: currentProductos.map((productoData) =>
          productoData?.producto_id === action?.payload?.producto_id
            ? action.payload
            : productoData
        ),
      };
    },
    ajustarStock: (state, action) => {
      const { productoId, delta } = action.payload || {};
      if (!productoId || typeof delta !== "number") return state;

      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.producto_id === productoId
            ? {
                ...producto,
                Stock: Math.max(
                  Number.isFinite(producto.Stock) ? producto.Stock + delta : delta,
                  0
                ),
              }
            : producto
        ),
      };
    },
    establecerStock: (state, action) => {
      const { productoId, stock } = action.payload || {};
      if (!productoId || typeof stock !== "number") return state;

      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.producto_id === productoId
            ? {
                ...producto,
                Stock: Math.max(stock, 0),
              }
            : producto
        ),
      };
    },
  },
});

export const {
  getProductos,
  getCategorias,
  setFiltros,
  addProducto,
  deleteProducto,
  editProducto,
  ajustarStock,
  establecerStock,
} = productoDataSlice.actions;

export const selectProductos = (state) =>
  state?.producto?.productos ?? initialState.productos;

export const selectProductosBajoStock = (minimo = 0) => (state) =>
  selectProductos(state).filter(
    (producto) =>
      typeof producto?.Stock === "number" && producto.Stock <= minimo
  );

// Funciones API para interactuar con el backend

export const getProductosAPI = (options = {}) => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    sesion,
    marca,
    proveedorId,
    stockMin,
    stockMax,
    fechaDesde,
    fechaHasta,
  } = options;

  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/productos`, {
        params: {
          page,
          pageSize,
          search,
          sesion,
          marca,
          proveedorId,
          stockMin,
          stockMax,
          fechaDesde,
          fechaHasta,
        },
      });

      if (response.status === 200) {
        dispatch(getProductos(response.data));
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };
};

export const getCategoriasAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/productos/categorias`);

      if (response.status === 200) {
        dispatch(getCategorias(response.data));
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };
};

export const getProductosFiltrosAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/productos/filtros`);
      if (response.status === 200) {
        dispatch(setFiltros(response.data));
      }
    } catch (error) {
      console.error("Error al obtener filtros de productos:", error);
    }
  };
};

export const addProductoAPI = (productoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/productos`, productoData);

      if (response.status === 201) {
        const categoriaNormalizada =
          productoData.Categoria ?? productoData.categoria ?? "";
        const newProducto = {
          producto_id: response.data.producto_id,
          Nombre: productoData.nombre,
          Codigo: productoData.codigo,
          Marca: productoData.marca,
          Categoria: categoriaNormalizada,
          categoria: categoriaNormalizada,
          categoria_id: productoData.categoria_id,
          Stock: productoData.stock,
          Precio: productoData.precio,
          Proveedor: "",
          proveedor_id: productoData.proveedor_id || null,
          FechaCreacion: new Date().toISOString(),
        };

        dispatch(addProducto(newProducto));
        Swal.fire({
          icon: "success",
          title: "Producto agregado",
          text: "El producto ha sido agregado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      
      if (error.response && error.response.status === 409) {
        // Error 409: Conflicto (probablemente código duplicado)
        const mensaje = error.response.data?.mensaje || error.response.data?.message || 
          `El código "${productoData.codigo}" ya existe. Por favor, use un código diferente.`;
        
        Swal.fire({
          icon: "warning",
          title: "Código duplicado",
          text: mensaje,
        });
      } else if (error.response && error.response.status) {
        // Otros errores HTTP
        const mensaje = error.response.data?.mensaje || error.response.data?.message || 
          `Error ${error.response.status}: No se pudo agregar el producto.`;
        
        Swal.fire({
          icon: "error",
          title: "Error",
          text: mensaje,
        });
      } else {
        // Error de conexión
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
        });
      }
    }
  };
};

export const deleteProductoAPI = (productoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/productos/delete/${productoData.producto_id}`,
        productoData
      );

      if (response.status === 200) {
        dispatch(deleteProducto(productoData.producto_id));
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          text: "El producto ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el producto.",
      });
    }
  };
};

export const editProductoAPI = (productoData) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.put(
        `${API}/productos/${productoData.producto_id}`,
        productoData
      );

      if (response.status === 200) {
        const state = getState();
        const current =
          state?.producto?.productos?.find(
            (item) => item.producto_id === productoData.producto_id
          ) || {};
        const categoriaNormalizada =
          productoData.Categoria ??
          productoData.categoria ??
          current.Categoria ??
          current.categoria ??
          "";

        const editarProducto = {
          producto_id: productoData.producto_id,
          Nombre: productoData.nombre,
          Codigo: productoData.codigo,
          Marca: productoData.marca,
          Categoria: categoriaNormalizada,
          categoria: categoriaNormalizada,
          categoria_id: productoData.categoria_id,
          Stock: productoData.stock,
          Precio: productoData.precio,
          Proveedor: productoData.Proveedor ?? current.Proveedor ?? "",
          proveedor_id: productoData.proveedor_id ?? current.proveedor_id ?? null,
          FechaCreacion:
            current.FechaCreacion ?? new Date().toISOString(),
        };
        dispatch(editProducto(editarProducto));
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el producto.",
      });
    }
  };
};

export default productoDataSlice.reducer;
