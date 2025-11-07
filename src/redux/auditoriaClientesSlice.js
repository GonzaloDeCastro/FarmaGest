/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const auditoriaClientesSlice = createSlice({
  name: "auditoria clientes",
  initialState: {
    initialState: [],
  },
  reducers: {
    getAuditoriaClientes: (state, action) => {
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

export const { getAuditoriaClientes } = auditoriaClientesSlice.actions;

// Funciones API para interactuar con el backend

export const getAuditoriaClientesAPI = (page, pageSize, search) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/auditoria-clientes`, {
        params: {
          page,
          pageSize,
          search,
        },
      });
      if (response.status === 200) {
        dispatch(getAuditoriaClientes(response.data));
      }
    } catch (error) {
      console.error("Error al obtener auditoria clientes:", error);
    }
  };
};

export default auditoriaClientesSlice.reducer;
