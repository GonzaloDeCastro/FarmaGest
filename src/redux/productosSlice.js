/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const productoDataSlice = createSlice({
  name: "producto",
  initialState: {},
  categoriasState: {},
  reducers: {
    getProductos: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    getCategorias: (state, action) => {
      return {
        ...state,
        categoriasState: action.payload,
      };
    },
    addProducto: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },

    deleteProducto: (state, action) => {
      return {
        ...state,
        initialState: state?.initialState?.filter(
          (productoData) => productoData?.producto_id !== action?.payload
        ),
      };
    },
    editProducto: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((productoData) =>
          productoData?.producto_id === action?.payload?.producto_id
            ? action.payload
            : productoData
        ),
      };
    },
  },
});

export const {
  getProductos,
  getCategorias,
  addProducto,
  deleteProducto,
  editProducto,
} = productoDataSlice.actions;

// Funciones API para interactuar con el backend

export const getProductosAPI = (page, pageSize, search, categoriaID) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/productos`, {
        params: {
          page,
          pageSize,
          search,
          categoriaID,
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

export const addProductoAPI = (productoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/productos`, productoData);

      if (response.status === 201) {
        const newProducto = {
          producto_id: response.data.producto_id,
          Nombre: productoData.nombre,
          Codigo: productoData.codigo,
          Marca: productoData.marca,
          Categoria: productoData.Categoria,
          categoria_id: productoData.categoria_id,
          Stock: productoData.stock,
          Precio: productoData.precio,
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el producto.",
      });
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
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/productos/${productoData.producto_id}`,
        productoData
      );

      if (response.status === 200) {
        const editarProducto = {
          producto_id: productoData.producto_id,
          Nombre: productoData.nombre,
          Codigo: productoData.codigo,
          Marca: productoData.marca,
          Categoria: productoData.Categoria,
          categoria_id: productoData.categoria_id,
          Stock: productoData.stock,
          Precio: productoData.precio,
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
