// En redux/ventasSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const ventasSlice = createSlice({
  name: "ventas",
  initialState: {},
  ultimaVentaState: {},
  facturaState: {},
  reducers: {
    getVentas: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    getUltimaVenta: (state, action) => {
      return {
        ...state,
        ultimaVentaState: action.payload,
      };
    },
    addVenta: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },
    verFacturaVenta: (state, action) => {
      return {
        ...state,
        facturaState: action.payload,
      };
    },
  },
});

export const { getVentas, getUltimaVenta, addVenta, verFacturaVenta } =
  ventasSlice.actions;

export const getVentasAPI = (page, pageSize, search) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas`, {
      params: { page, pageSize, search },
    });
    if (response.status === 200) {
      dispatch(getVentas(response.data));
      console.log("response.data ", response.data);
    }
  } catch (error) {
    console.error("Error al obtener ventas:", error);
  }
};

export const getUltimaVentaAPI = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas/ultima-venta`);
    if (response.status === 200) {
      dispatch(getUltimaVenta(response.data));
    }
  } catch (error) {
    console.error("Error al obtener ventas:", error);
  }
};
export const verFacturaVentaAPI = (ventaId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas/venta-id/${ventaId}`);
    if (response.status === 200) {
      dispatch(verFacturaVenta(response.data));
    }
  } catch (error) {
    console.error("Error al obtener factura:", error);
  }
};

export const addVentaAPI = (ventaData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/ventas`, ventaData);
      if (response.status === 201) {
        //dispatch(addVenta(ventaData));
        const response = await axios.get(`${API}/ventas`, {
          params: { page: 1, pageSize: 8, search: "" },
        });
        if (response.status === 200) {
          dispatch(getVentas(response.data));
        }
        Swal.fire({
          icon: "success",
          title: "Factura creada",
          text: "La factura se ha creado correctamente.",
        });
      }
    } catch (error) {
      if (error.response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data.mensaje,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.mensaje,
        });
      }
    }
  };
};

export default ventasSlice.reducer;
