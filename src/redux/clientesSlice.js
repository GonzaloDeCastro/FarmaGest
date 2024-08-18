/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const clientesSlice = createSlice({
  name: "clientes",
  initialState: {},
  obrasSocialesState: {},
  ciudadesState: {},
  reducers: {
    getClientes: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    getObrasSociales: (state, action) => {
      return {
        ...state,
        obrasSocialesState: action.payload,
      };
    },
    getCiudades: (state, action) => {
      return {
        ...state,
        ciudadesState: action.payload,
      };
    },
    addCliente: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },
    deleteCliente: (state, action) => {
      return {
        ...state,
        initialState: state.initialState?.filter(
          (cliente) => cliente?.cliente_id !== action?.payload
        ),
      };
    },
    editCliente: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((cliente) =>
          cliente?.cliente_id === action?.payload?.cliente_id
            ? action.payload
            : cliente
        ),
      };
    },
  },
});

export const {
  getClientes,
  getObrasSociales,
  getCiudades,
  addCliente,
  deleteCliente,
  editCliente,
} = clientesSlice.actions;

// Funciones API para interactuar con el backend

export const getClientesAPI = (
  page,
  pageSize,
  search,
  obraSocialID,
  ciudadID
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/clientes`, {
        params: {
          page,
          pageSize,
          search,
          obraSocialID,
          ciudadID,
        },
      });

      if (response.status === 200) {
        dispatch(getClientes(response.data));
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };
};

export const addClienteAPI = (clienteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/clientes`, clienteData);

      if (response.status === 201) {
        const newCliente = {
          cliente_id: response.data.cliente_id,
          Nombre: clienteData.nombre,
          Apellido: clienteData.apellido,
          DNI: clienteData.dni,
          obra_social_id: clienteData.obra_social_id,
          obra_social: clienteData.obra_social,
          ciudad_id: clienteData.ciudad_id,
          Ciudad: clienteData.Ciudad,
        };

        dispatch(addCliente(newCliente));
        Swal.fire({
          icon: "success",
          title: "Cliente agregado",
          text: "El cliente ha sido agregado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el cliente.",
      });
    }
  };
};

export const deleteClienteAPI = (clienteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}/clientes/${clienteData.cliente_id}`
      );

      if (response.status === 200) {
        dispatch(deleteCliente(clienteData.cliente_id));
        Swal.fire({
          icon: "success",
          title: "Cliente eliminado",
          text: "El cliente ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el cliente.",
      });
    }
  };
};

export const editClienteAPI = (clienteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/clientes/${clienteData.cliente_id}`,
        clienteData
      );

      if (response.status === 200) {
        const editarCliente = {
          cliente_id: clienteData.cliente_id,
          Nombre: clienteData.nombre,
          Apellido: clienteData.apellido,
          DNI: clienteData.dni,
          obra_social_id: clienteData.obra_social_id,
          obra_social: clienteData.obra_social,
          ciudad_id: clienteData.ciudad_id,
          Ciudad: clienteData.Ciudad,
        };
        dispatch(editCliente(editarCliente));
        Swal.fire({
          icon: "success",
          title: "Cliente actualizado",
          text: "El cliente ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el cliente.",
      });
    }
  };
};

export const getObrasSocialesAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/clientes/obras-sociales`);

      if (response.status === 200) {
        dispatch(getObrasSociales(response.data));
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };
};

export const getCiudadesAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/clientes/ciudades`);

      if (response.status === 200) {
        dispatch(getCiudades(response.data));
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };
};

export default clientesSlice.reducer;
