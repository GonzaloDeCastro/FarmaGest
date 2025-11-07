/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const sesionesSlice = createSlice({
  name: "sesiones",
  initialState: {
    sesionState: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
    },
  },
  reducers: {
    getSesiones: (state, action) => {
      const payload = action.payload;
      const sesiones = Array.isArray(payload?.sesiones)
        ? payload.sesiones
        : Array.isArray(payload)
        ? payload
        : [];

      state.sesionState = sesiones;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
        };
      }
    },
  },
});

export const { getSesiones } = sesionesSlice.actions;

// Funciones API para interactuar con el backend
export const getSesionesAPI = (page, pageSize, search) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/sesiones`, {
        params: {
          page,
          pageSize,
          search,
        },
      });

      if (response.status === 200) {
        dispatch(getSesiones(response.data));
      }
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
    }
  };
};

export default sesionesSlice.reducer;
