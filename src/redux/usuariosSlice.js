/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const usuarioDataSlice = createSlice({
  name: "usuario",
  initialState: {},
  rolesState: {},
  loginState: {},
  reducers: {
    getUsuarioLogin: (state, action) => {
      return {
        ...state,
        loginState: action.payload,
      };
    },
    logoutUsuario: (state) => {
      return {
        ...state,
        loginState: {},
      };
    },
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

export const {
  getUsuarioLogin,
  logoutUsuario,
  getUsuarios,
  getRoles,
  addUsuario,
  deleteUsuario,
  editUsuario,
} = usuarioDataSlice.actions;

// Funciones API para interactuar con el backend

export const getUsuariosAPI = (page, pageSize, search, rolID) => {
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
      if (error.response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data.mensaje,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.mensaje,
        });
      }
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

export const getUsuarioLoginAPI = (
  correo,
  password,
  ip_address,
  user_agent
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios/login`, {
        params: {
          correo: correo && correo,
          contrasena: password && password,
          ip_address: ip_address && ip_address,
          user_agent: user_agent && user_agent,
        },
      });

      if (response.status === 200) {
        dispatch(getUsuarioLogin(response.data));
      }
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Advertencia!",
          text: "Error 500",
        });
      }
    }
  };
};

export const updatePasswordDataAPI = (dataUser) => {
  const { correo, currentPassword } = dataUser;
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios/login`, {
        params: {
          correo: correo && correo,
          contrasena: currentPassword && currentPassword,
        },
      });
      if (response?.data.correo !== undefined) {
        const action = response?.data;
        if (action !== 1) {
          const response2 = await axios.put(
            `${API}/usuarios/pwd/${correo}`,
            dataUser
          );
          if (response2?.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Password actualizado",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Password no pudo actualizarse",
            });
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password invalido",
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response.data,
        });
      }
    }
  };
};

export const resetPasswordDataAPI = (dataUser) => {
  const { correo } = dataUser;

  return async (dispatch) => {
    try {
      const response2 = await axios.put(
        `${API}/usuarios/pwd/${correo}`,
        dataUser
      );
      if (response2?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password Updated",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password cannot be updated",
        });
      }
    } catch (error) {}
  };
};

export const logoutUsuarioAPI = (sesion_id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${API}/usuarios/logout/${sesion_id}`);
      if (response && response?.status === 200) {
        dispatch(logoutUsuario());
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export default usuarioDataSlice.reducer;
