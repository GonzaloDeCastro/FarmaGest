/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const auditoriaObrasSocialesSlice = createSlice({
  name: "auditoria obras sociales",
  initialState: {
    initialState: [],
  },
  reducers: {
    getAuditoriaObrasSociales: (state, action) => {
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

export const { getAuditoriaObrasSociales } =
  auditoriaObrasSocialesSlice.actions;

// Funciones API para interactuar con el backend

export const getAuditoriaObrasSocialesAPI = (page, pageSize, search) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/auditoria-obras-sociales`, {
        params: {
          page,
          pageSize,
          search,
        },
      });
      if (response.status === 200) {
        dispatch(getAuditoriaObrasSociales(response.data));
      }
    } catch (error) {
      console.error("Error al obtener auditoria obras sociales:", error);
    }
  };
};

export default auditoriaObrasSocialesSlice.reducer;
