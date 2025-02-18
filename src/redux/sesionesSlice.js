/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const sesionesSlice = createSlice({
  name: "sesiones",
  initialState: {},
  reducers: {
    getSesiones: (state, action) => {
      return {
        ...state,
        sesionState: action.payload,
      };
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
      console.log("response sesiones", response);
      if (response.status === 200) {
        console.log("response sesiones data", response.data);
        dispatch(getSesiones(response.data));
      }
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
    }
  };
};

export default sesionesSlice.reducer;
