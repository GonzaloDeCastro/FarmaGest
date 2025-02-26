/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const obraSocialDataSlice = createSlice({
  name: "obra_social",
  initialState: {},
  reducers: {
    getObrasSociales: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    addObraSocial: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },
    deleteObraSocial: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.filter(
          (obraSocial) => obraSocial.obra_social_id !== action.payload
        ),
      };
    },
    editObraSocial: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((obraSocial) =>
          obraSocial.obra_social_id == action.payload.obra_social_id
            ? action.payload
            : obraSocial
        ),
      };
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

export const deleteObraSocialAPI = (obraSocialId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}/obras-sociales/${obraSocialId}`
      );
      if (response.status === 200) {
        dispatch(deleteObraSocial(obraSocialId));
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
