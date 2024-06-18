import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";
//guarda que al cargar todos los datos, quito los atributos color y dimension y por eso no aparecen
const usuarioDataSlice = createSlice({
  name: "usuario",
  initialState: {},
  rolesState: {},
  obrasSocialesState: {},
  reducers: {
    getUsuarioData: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    getRolesData: (state, action) => {
      return {
        ...state,
        rolesState: action.payload,
      };
    },
    getObrasSocialesData: (state, action) => {
      return {
        ...state,
        obrasSocialesState: action.payload,
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
  getRolesData,
  deleteUsuarioData,
  editUsuarioData,
  getObrasSocialesData,
} = usuarioDataSlice.actions;

export const addUsuarioDataAPI = (usuarioData) => async (dispatch) => {
  const { nombre, apellido, correo_electronico, Rol, rol_id, obraSocial } =
    usuarioData;

  try {
    const response = await axios.post(`${API}usuarios/`, usuarioData);
    if (response.status === 200) {
      const newUsuario = {
        usuario_id: response.data.insertId,
        Nombre: nombre,
        Apellido: apellido,
        Email: correo_electronico,
        Rol: Rol,
      };
      const userRole = {
        usuario_id: response.data.insertId,
        rol_id: parseInt(rol_id),
      };

      await axios.post(`${API}usuarios/rol/`, userRole);
      const userOs = {
        usuario_id: response.data.insertId,
        codigo: parseInt(obraSocial),
      };
      if (rol_id == 1) {
        await axios.post(`${API}usuarios/obra-social/`, userOs);
      }

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
  const { rol_id } = usuarioData;
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}usuarios/rol/${parseInt(usuarioData.usuario_id)}`
      );
      if (rol_id == 1) {
        await axios.delete(
          `${API}usuarios/obra-social/${parseInt(usuarioData.usuario_id)}`
        );
      }
      if (response.status === 200) {
        await axios.delete(
          `${API}usuarios/${parseInt(usuarioData.usuario_id)}`
        );
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
  const {
    nombre,
    apellido,
    correo_electronico,
    usuario_id,
    Rol,
    obraSocial,
    rol_id,
  } = usuarioData;
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}usuarios/rol/${parseInt(usuario_id)}`
      );
      if (rol_id == 1) {
        await axios.delete(
          `${API}usuarios/obra-social/${parseInt(usuario_id)}`
        );
      }

      const userRole = {
        usuario_id: parseInt(usuario_id),
        rol_id: parseInt(rol_id),
      };

      const response2 = await axios.post(`${API}usuarios/rol/`, userRole);
      const userOs = {
        usuario_id: usuario_id,
        codigo: parseInt(obraSocial),
      };
      if (rol_id == 1) {
        await axios.post(`${API}usuarios/obra-social/`, userOs);
      }

      if (response.status === 200 && response2.status === 200) {
        const response3 = await axios.put(
          `${API}usuarios/${parseInt(usuarioData.usuario_id)}`,
          usuarioData
        );
        if (response3.status === 200) {
          const editUsuario = {
            usuario_id: usuario_id,
            Nombre: nombre,
            Apellido: apellido,
            Email: correo_electronico,
            Rol: Rol,
          };
          const action = editUsuarioData(editUsuario);
          dispatch(action);
          Swal.fire({
            title: "Success!",
            text: `Usuario ${usuarioData.nombre} ha sido actualizado!`,
            icon: "success",
          });
        }
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

export const getUsuarioDataAPI = (
  page = 1,
  pageSize = 5,
  search = "",
  rolID = 0
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}usuarios/all`, {
        params: {
          page,
          pageSize,
          search,
          rolID,
        },
      });

      if (response.status === 200) {
        const action = getUsuarioData(response.data);

        dispatch(action);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export const getRolesDataAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}usuarios/roles`);
      if (response.status === 200) {
        const action = getRolesData(response.data);
        dispatch(action);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export const getObrasSocialesDataAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}usuarios/obras-sociales`);
      if (response.status === 200) {
        const action = getObrasSocialesData(response.data);
        dispatch(action);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export default usuarioDataSlice.reducer;
