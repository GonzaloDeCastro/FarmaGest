/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const initialState = {
  initialState: [],
  pagination: {
    total: 0,
    page: 1,
    pageSize: 5,
  },
};

const obraSocialDataSlice = createSlice({
  name: "obra_social",
  initialState,
  reducers: {
    getObrasSociales: (state, action) => {
      const payload = action.payload;

      const obras = Array.isArray(payload?.obrasSociales)
        ? payload.obrasSociales
        : Array.isArray(payload)
        ? payload
        : [];

      state.initialState = obras;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
        };
      }
    },
    addObraSocial: (state, action) => {
      const currentObras = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = [action.payload, ...currentObras];
    },
    deleteObraSocial: (state, action) => {
      const currentObras = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = currentObras.filter(
        (obraSocial) => obraSocial.obra_social_id !== action.payload
      );
    },
    editObraSocial: (state, action) => {
      const currentObras = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = currentObras.map((obraSocial) =>
        obraSocial.obra_social_id === action.payload.obra_social_id
          ? action.payload
          : obraSocial
      );
    },
  },
});

export const {
  getObrasSociales,
  addObraSocial,
  deleteObraSocial,
  editObraSocial,
} = obraSocialDataSlice.actions;

// Funciones API para interactuar con el backend

export const getObrasSocialesAPI = (
  page = 1,
  pageSize = 5,
  search = "",
  sesion
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/obras-sociales`, {
        params: {
          page,
          pageSize,
          search,
          sesion,
        },
      });
      if (response.status === 200) {
        dispatch(getObrasSociales(response.data));
      }
    } catch (error) {
      console.error("Error al obtener obras sociales:", error);
    }
  };
};

export const addObraSocialAPI = (obraSocialData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${API}/obras-sociales`,
        obraSocialData
      );
      if (response.status === 201) {
        const nuevaObraSocial = {
          obra_social_id: response.data.obra_social_id,
          obra_social: obraSocialData.obra_social,
          Plan: obraSocialData.plan,
          Descuento: obraSocialData.descuento,
          Codigo: obraSocialData.codigo,
        };
        dispatch(addObraSocial(nuevaObraSocial));
        Swal.fire({
          icon: "success",
          title: "Obra social agregada",
          text: "La obra social ha sido agregada correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al agregar obra social:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar la obra social.",
      });
    }
  };
};

export const deleteObraSocialAPI = (dato) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/obras-sociales/delete/${dato.obra_social_id}`,
        dato
      );
      if (response.status === 200) {
        dispatch(deleteObraSocial(dato.obra_social_id));
        Swal.fire({
          icon: "success",
          title: "Obra social eliminada",
          text: "La obra social ha sido eliminada correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar obra social:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar la obra social.",
      });
    }
  };
};

export const editObraSocialAPI = (obraSocialData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/obras-sociales/${obraSocialData.obra_social_id}`,
        obraSocialData
      );
      if (response.status === 200) {
        const newEditObraSocial = {
          obra_social_id: obraSocialData.obra_social_id,
          obra_social: obraSocialData.obra_social,
          Plan: obraSocialData.plan,
          Descuento: obraSocialData.descuento,
          Codigo: obraSocialData.codigo,
        };
        dispatch(editObraSocial(newEditObraSocial));

        Swal.fire({
          icon: "success",
          title: "Obra social actualizada",
          text: "La obra social ha sido actualizada correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar obra social:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la obra social.",
      });
    }
  };
};

export default obraSocialDataSlice.reducer;
