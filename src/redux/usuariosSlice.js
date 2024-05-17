import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";
//guarda que al cargar todos los datos, quito los atributos color y dimension y por eso no aparecen
const usuarioDataSlice = createSlice({
  name: "usuario",
  initialState: {},
  reducers: {
    getUsuarioData: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    addUsuarioData: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },

    deleteUsuarioData: (state, action) => {
      return {
        ...state,
        initialState: state?.initialState?.filter(
          (usuarioData) => usuarioData?.usuario_id !== action?.payload
        ),
      };
    },
    editUsuarioData: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((usuarioData) =>
          usuarioData?.usuario_id === action?.payload?.usuario_id
            ? action.payload
            : usuarioData
        ),
      };
    },
  },
});

export const {
  addUsuarioData,
  getUsuarioData,
  deleteUsuarioData,
  editUsuarioData,
} = usuarioDataSlice.actions;

export const addUsuarioDataAPI = (usuarioData) => async (dispatch) => {
  const { nombre, apellido, correo } = usuarioData;
  try {
    const response = await axios.post(`${API}usuarios/`, usuarioData);
    if (response.status === 200) {
      const newUsuario = {
        usuario_id: response.data.insertId,
        Usuario: nombre,
        Apellido: apellido,
        Correo: correo,
      };

      const action = addUsuarioData(newUsuario);
      dispatch(action);
      Swal.fire({
        title: "Success!",
        text: `${usuarioData.nombre} has been added!`,
        icon: "success",
      });
    }
  } catch (error) {
    throw error;
  }
};
export const deleteUsuarioDataAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}usuarios/${parseInt(usuarioData.usuario_id)}`
      );

      if (response.status === 200) {
        const action = deleteUsuarioData(usuarioData.usuario_id);
        dispatch(action);

        Swal.fire({
          title: "Exito!",
          text: `${usuarioData.Usuario} ha sido eliminado!`,
          icon: "success",
        });
      }
    } catch (error) {}
  };
};

export const editarUsuarioDataAPI = (usuarioData) => {
  const { nombre, apellido, correo, usuario_id } = usuarioData;
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}usuarios/${parseInt(usuarioData.usuario_id)}`,
        usuarioData
      );
      if (response.status === 200) {
        const editUsuario = {
          usuario_id: usuario_id,
          Usuario: nombre,
          Apellido: apellido,
          Correo: correo,
        };
        const action = editUsuarioData(editUsuario);
        dispatch(action);
        Swal.fire({
          title: "Success!",
          text: `Usuario ${usuarioData.nombre} ha sido actualizado!`,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
      });
    }
  };
};

export const getUsuarioDataAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}usuarios/all`);
      if (response.status === 200) {
        const action = getUsuarioData(response.data);
        dispatch(action);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export default usuarioDataSlice.reducer;
