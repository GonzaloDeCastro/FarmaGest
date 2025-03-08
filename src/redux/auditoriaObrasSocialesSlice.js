/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const auditoriaObrasSocialesSlice = createSlice({
  name: "auditoria obras sociales",
  initialState: {},
  reducers: {
    getAuditoriaObrasSociales: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
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
