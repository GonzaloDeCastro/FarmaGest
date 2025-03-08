/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const auditoriaClientesSlice = createSlice({
  name: "auditoria clientes",
  initialState: {},
  reducers: {
    getAuditoriaClientes: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
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
        console.log(response.data);
        dispatch(getAuditoriaClientes(response.data));
      }
    } catch (error) {
      console.error("Error al obtener auditoria clientes:", error);
    }
  };
};

export default auditoriaClientesSlice.reducer;
