/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const auditoriaProductosSlice = createSlice({
  name: "auditoria productos",
  initialState: {},
  reducers: {
    getAuditoriaProductos: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
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
