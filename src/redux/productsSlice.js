import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";
//guarda que al cargar todos los datos, quito los atributos color y dimension y por eso no aparecen
const productDataSlice = createSlice({
  name: "product",
  initialState: {},
  reducers: {
    getProductData: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    addProductData: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },

    deleteProductData: (state, action) => {
      return {
        ...state,
        initialState: state?.initialState?.filter(
          (productData) => productData?.producto_id !== action?.payload
        ),
      };
    },
    editProductData: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((productData) =>
          productData?.producto_id === action?.payload?.producto_id
            ? action.payload
            : productData
        ),
      };
    },
  },
});

export const {
  addProductData,
  getProductData,
  deleteProductData,
  editProductData,
} = productDataSlice.actions;

export const addProductDataAPI = (productData) => async (dispatch) => {
  const { nombre_producto, precio, cantidad } = productData;
  try {
    const response = await axios.post(`${API}productos/`, productData);
    if (response.status === 200) {
      const newProduct = {
        producto_id: response.data.insertId,
        Producto: nombre_producto,
        Precio: precio,
        Cantidad: cantidad,
      };

      const action = addProductData(newProduct);
      dispatch(action);
      Swal.fire({
        title: "Success!",
        text: `${productData.nombre_producto} has been added!`,
        icon: "success",
      });
    }
  } catch (error) {
    throw error;
  }
};
export const deleteProductDataAPI = (productData) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}productos/${parseInt(productData.producto_id)}`
      );

      if (response.status === 200) {
        const action = deleteProductData(productData.producto_id);
        dispatch(action);

        Swal.fire({
          title: "Exito!",
          text: `${productData.Producto} ha sido eliminado!`,
          icon: "success",
        });
      }
    } catch (error) {}
  };
};

export const editarProductDataAPI = (productData) => {
  const { nombre_producto, precio, cantidad, producto_id } = productData;
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}productos/${parseInt(productData.producto_id)}`,
        productData
      );
      if (response.status === 200) {
        const editProduct = {
          producto_id: producto_id,
          Producto: nombre_producto,
          Precio: precio,
          Cantidad: cantidad,
        };
        const action = editProductData(editProduct);
        dispatch(action);
        Swal.fire({
          title: "Success!",
          text: `Producto ${productData.nombre_producto} ha sido actualizado!`,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
      });
    }
  };
};

export const getProductDataAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}productos/all`);
      if (response.status === 200) {
        const action = getProductData(response.data);
        dispatch(action);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export default productDataSlice.reducer;
