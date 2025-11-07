/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const auditoriaProductosSlice = createSlice({
  name: "auditoria productos",
  initialState: {
    initialState: [],
  },
  reducers: {
    getAuditoriaProductos: (state, action) => {
      const payload = action.payload;
      const auditoria = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.auditoria)
        ? payload.auditoria
        : [];

      state.initialState = auditoria;
    },
  },
});

export const { getAuditoriaProductos } = auditoriaProductosSlice.actions;

// Funciones API para interactuar con el backend

export const getAuditoriaProductosAPI = (page, pageSize, search) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/auditoria-productos`, {
        params: {
          page,
          pageSize,
          search,
        },
      });
      if (response.status === 200) {
        dispatch(getAuditoriaProductos(response.data));
      }
    } catch (error) {
      console.error("Error al obtener auditoria productos:", error);
    }
  };
};

export default auditoriaProductosSlice.reducer;
