/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const usuarioDataSlice = createSlice({
  name: "usuario",
  initialState: {},
  rolesState: {},
  reducers: {
    getUsuarios: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    getRoles: (state, action) => {
      return {
        ...state,
        rolesState: action.payload,
      };
    },
    addUsuario: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },

    deleteUsuario: (state, action) => {
      return {
        ...state,
        initialState: state?.initialState?.filter(
          (usuarioData) => usuarioData?.usuario_id !== action?.payload
        ),
      };
    },
    editUsuario: (state, action) => {
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

export const { getUsuarios, getRoles, addUsuario, deleteUsuario, editUsuario } =
  usuarioDataSlice.actions;

// Funciones API para interactuar con el backend

export const getUsuariosAPI = (
  page = 1,
  pageSize = 5,
  search = "",
  rolID = 0
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios`, {
        params: {
          page,
          pageSize,
          search,
          rolID,
        },
      });

      if (response.status === 200) {
        dispatch(getUsuarios(response.data));
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };
};

export const getRolesAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios/roles`);

      if (response.status === 200) {
        dispatch(getRoles(response.data));
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };
};

export const addUsuarioAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/usuarios`, usuarioData);

      if (response.status === 201) {
        const newUsuario = {
          usuario_id: response.data.usuario_id,
          Nombre: usuarioData.nombre,
          Apellido: usuarioData.apellido,
          Correo: usuarioData.correo,
          Rol: usuarioData.Rol,
          rol_id: usuarioData.rol_id,
        };

        dispatch(addUsuario(newUsuario));
        Swal.fire({
          icon: "success",
          title: "Usuario agregado",
          text: "El usuario ha sido agregado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el usuario.",
      });
    }
  };
};

export const deleteUsuarioAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}/usuarios/${usuarioData.usuario_id}`
      );

      if (response.status === 200) {
        dispatch(deleteUsuario(usuarioData.usuario_id));
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: "El usuario ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el usuario.",
      });
    }
  };
};

export const editUsuarioAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/usuarios/${usuarioData.usuario_id}`,
        usuarioData
      );

      if (response.status === 200) {
        const editarUsuario = {
          usuario_id: usuarioData.usuario_id,
          Nombre: usuarioData.nombre,
          Apellido: usuarioData.apellido,
          Correo: usuarioData.correo,
          Rol: usuarioData.Rol,
          rol_id: usuarioData.rol_id,
        };
        dispatch(editUsuario(editarUsuario));
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "El usuario ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el usuario.",
      });
    }
  };
};

export default usuarioDataSlice.reducer;
