// En redux/reportesSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const reportesSlice = createSlice({
  name: "reportes",
  initialState: {
    initialState: [],
  },
  reducers: {
    getVentas: (state, action) => {
      state.initialState = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { getVentas } = reportesSlice.actions;

// Selector memoizado para evitar re-renders innecesarios
export const selectReportes = createSelector(
  [(state) => state.reporte?.initialState],
  (initialState) => Array.isArray(initialState) ? initialState : []
);

export const getReportesAPI =
  (dateSelectedFrom, dateSelectedTo, entitySelected, clienteProductoVendedor) =>
  async (dispatch) => {
    try {
      const response = await axios.get(`${API}/reportes`, {
        params: {
          dateSelectedFrom: dateSelectedFrom,
          dateSelectedTo: dateSelectedTo,
          entitySelected: entitySelected,
          clienteProductoVendedor: clienteProductoVendedor,
        },
      });
      if (response.status === 200) {
        dispatch(getVentas(response.data));
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

export default reportesSlice.reducer;
