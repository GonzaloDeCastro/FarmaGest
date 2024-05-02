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
          (productData) => productData?.id != action?.payload
        ),
      };
    },
    editProductData: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((productData) =>
          productData?.product_id == action?.payload?.product_id
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
  console.log("productData ", productData);
  try {
    const response = await axios.post(`${API}products/`, productData);
    if (response.status === 200) {
      if (productData.attributes !== undefined) {
        productData.attributes = JSON.parse(productData.attributes);
      }

      const newProductId = response.data.newProductId;
      const isManual = response.data.isManual;
      let productDataWithId = {
        ...Object.keys(productData).reduce((acc, key, index) => {
          if (index === 1) {
            acc["is_manual"] = isManual;
          }
          acc[key] = productData[key];
          return acc;
        }, {}),
      };
      productDataWithId = {
        ...productDataWithId,
        product_id: newProductId,
      };

      const action = addProductData(productDataWithId);
      dispatch(action);
      Swal.fire({
        title: "Success!",
        text: `${productData.product_desc} has been added!`,
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
        `${API}productos/${parseInt(productData.id)}`
      );

      if (response.status === 200) {
        const action = deleteProductData(parseInt(productData.id));
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
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}products/${parseInt(productData.product_id)}`,
        productData
      );
      if (response.status === 200) {
        if (productData.attributes !== undefined) {
          productData.attributes = JSON.parse(productData.attributes);
        }
        const isManual = response.data.isManual;

        const productDataKeys = Object.keys(productData);

        let productDataWithIsManual = {};

        productDataKeys.forEach((key, index) => {
          productDataWithIsManual[key] = productData[key];
          if (index === 1) {
            productDataWithIsManual["is_manual"] = isManual;
          }
        });

        const action = editProductData(productDataWithIsManual);
        dispatch(action);
        Swal.fire({
          title: "Success!",
          text: `Product ${productData.Producto} has been updated!`,
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
