// En redux/reportesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const reportesSlice = createSlice({
  name: "reportes",
  initialState: {},
  reducers: {
    getVentas: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
  },
});

export const { getVentas } = reportesSlice.actions;

export const getReportesAPI =
  (dateSelectedFrom, dateSelectedTo, entitySelected, clienteProductoVendedor) =>
  async (dispatch) => {
    console.log(
      dateSelectedFrom,
      dateSelectedTo,
      entitySelected,
      clienteProductoVendedor
    );
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
