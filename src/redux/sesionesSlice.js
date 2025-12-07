/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const sesionesSlice = createSlice({
  name: "sesiones",
  initialState: {
    sesionState: [],
    loading: false,
    error: null,
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
      state.loading = false;
      state.error = null;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
        };
      }
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getSesiones, setLoading, setError } = sesionesSlice.actions;

// Funciones API para interactuar con el backend
export const getSesionesAPI = (page, pageSize, search) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading());
      const response = await axios.get(`${API}/sesiones`, {
        params: {
          page,
          pageSize,
          search,
        },
      });

      if (response.status === 200) {
        dispatch(getSesiones(response.data || []));
      } else {
        dispatch(setError("Error al obtener las sesiones"));
      }
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
      dispatch(setError(error.response?.data?.mensaje || error.message || "Error al obtener sesiones"));
      // Asegurarse de que siempre hay un array vacío en caso de error
      dispatch(getSesiones([]));
    }
  };
};

export default sesionesSlice.reducer;
