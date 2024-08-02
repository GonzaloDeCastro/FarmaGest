/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const proveedorDataSlice = createSlice({
  name: "proveedor",
  initialState: {},
  reducers: {
    getProveedores: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    addProveedor: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },
    deleteProveedor: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.filter(
          (proveedor) => proveedor.proveedor_id !== action.payload
        ),
      };
    },
    editProveedor: (state, action) => {
      return {
        ...state,
        initialState: state.initialState.map((proveedor) =>
          proveedor.proveedor_id == action.payload.proveedor_id
            ? action.payload
            : proveedor
        ),
      };
    },
  },
});

export const { getProveedores, addProveedor, deleteProveedor, editProveedor } =
  proveedorDataSlice.actions;

// Funciones API para interactuar con el backend

export const getProveedoresAPI = (page = 1, pageSize = 5, search = "") => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/proveedores`, {
        params: {
          page,
          pageSize,
          search,
        },
      });
      if (response.status === 200) {
        dispatch(getProveedores(response.data));
      }
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };
};

export const addProveedorAPI = (proveedorData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/proveedores`, proveedorData);

      if (response.status === 201) {
        const nuevoProveedor = {
          proveedor_id: response.data.proveedor_id,
          razon_social: proveedorData.razon_social,
          Telefono: proveedorData.telefono,
          Direccion: proveedorData.direccion,
          Email: proveedorData.email,
        };
        dispatch(addProveedor(nuevoProveedor));
        Swal.fire({
          icon: "success",
          title: "Proveedor agregado",
          text: "El proveedor ha sido agregado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al agregar proveedor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el proveedor.",
      });
    }
  };
};

export const deleteProveedorAPI = (proveedorId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API}/proveedores/${proveedorId}`);
      if (response.status === 200) {
        dispatch(deleteProveedor(proveedorId));
        Swal.fire({
          icon: "success",
          title: "Proveedor eliminado",
          text: "El proveedor ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el proveedor.",
      });
    }
  };
};

export const editProveedorAPI = (proveedorData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/proveedores/${proveedorData.proveedor_id}`,
        proveedorData
      );
      if (response.status === 200) {
        const EditProveedor = {
          proveedor_id: proveedorData.proveedor_id,
          razon_social: proveedorData.razon_social,
          Telefono: proveedorData.telefono,
          Direccion: proveedorData.direccion,
          Email: proveedorData.email,
        };
        dispatch(editProveedor(EditProveedor));

        Swal.fire({
          icon: "success",
          title: "Proveedor actualizado",
          text: "El proveedor ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el proveedor.",
      });
    }
  };
};

export default proveedorDataSlice.reducer;
