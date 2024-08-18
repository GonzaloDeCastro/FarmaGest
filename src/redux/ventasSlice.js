// En redux/ventasSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const ventasSlice = createSlice({
  name: "ventas",
  initialState: {},
  reducers: {
    getVentas: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    deleteVenta: (state, action) => {
      return {
        ...state,
        initialState: state.initialState?.filter(
          (venta) => venta?.venta_id !== action?.payload
        ),
      };
    },
  },
});

export const { getVentas, deleteVenta } = ventasSlice.actions;

export const getVentasAPI = (page, pageSize, search) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas`, {
      params: { page, pageSize, search },
    });
    if (response.status === 200) {
      dispatch(getVentas(response.data));
    }
  } catch (error) {
    console.error("Error al obtener ventas:", error);
  }
};

export const deleteVentaAPI = (ventaId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${API}/ventas/${ventaId}`);
    if (response.status === 200) {
      dispatch(deleteVenta(ventaId));
      Swal.fire("Eliminado!", "La venta ha sido eliminada.", "success");
    }
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    Swal.fire("Error", "Hubo un problema al eliminar la venta.", "error");
  }
};

export default ventasSlice.reducer;
