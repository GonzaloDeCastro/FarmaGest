// En redux/ventasSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const initialState = {
  initialState: [],
  ultimaVentaState: {},
  facturaState: {},
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
  },
};

const ventasSlice = createSlice({
  name: "ventas",
  initialState,
  reducers: {
    getVentas: (state, action) => {
      const payload = action.payload;

      const ventasRaw = Array.isArray(payload?.ventas)
        ? payload.ventas
        : Array.isArray(payload)
        ? payload
        : [];

      const normalizeVenta = (venta = {}) => {
        const fechaReferencia = venta.fecha_hora || venta.fecha || null;
        const fechaIso = fechaReferencia
          ? new Date(fechaReferencia).toISOString()
          : null;

        const subtotal = Number(
          venta.total_sin_descuento ?? venta.subtotal ?? 0
        );

        const descuentoValor = Number(venta.descuento ?? 0);
        const descuentoPorcentaje =
          descuentoValor <= 1 ? descuentoValor * 100 : descuentoValor;

        return {
          ...venta,
          fecha: fechaIso,
          fecha_hora: fechaIso,
          numero_factura:
            venta.numero_factura ||
            (venta.venta_id ? String(venta.venta_id).padStart(8, "0") : null),
          total_sin_descuento: subtotal,
          subtotal,
          descuento: descuentoPorcentaje,
          total: Number(venta.total ?? 0),
        };
      };

      const ventas = ventasRaw.map(normalizeVenta);

      state.initialState = ventas;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
        };
      }
    },
    getUltimaVenta: (state, action) => {
      state.ultimaVentaState = action.payload || {};
    },
    addVenta: (state, action) => {
      const currentVentas = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = [action.payload, ...currentVentas];
    },
    verFacturaVenta: (state, action) => {
      state.facturaState = action.payload || {};
    },
  },
});

export const { getVentas, getUltimaVenta, addVenta, verFacturaVenta } =
  ventasSlice.actions;

export const getVentasAPI =
  (page, pageSize, search, sesion) => async (dispatch) => {
    try {
      const response = await axios.get(`${API}/ventas`, {
        params: { page, pageSize, search, sesion },
      });
      if (response.status === 200) {
        dispatch(getVentas(response.data));
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

export const getUltimaVentaAPI = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas/ultima-venta`);
    if (response.status === 200) {
      dispatch(getUltimaVenta(response.data));
    }
  } catch (error) {
    console.error("Error al obtener ventas:", error);
  }
};

// Obtener historial de ventas de un cliente para recomendaciones IA
export const getVentasByClienteAPI = (clienteId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas/cliente/${clienteId}`);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error al obtener ventas del cliente:", error);
    return [];
  }
};
export const verFacturaVentaAPI = (ventaId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas/venta-id/${ventaId}`);
    if (response.status === 200) {
      dispatch(verFacturaVenta(response.data));
    }
  } catch (error) {
    console.error("Error al obtener factura:", error);
  }
};

export const addVentaAPI = (ventaData) => {
  return async (dispatch) => {
    try {
      const payload = {
        cliente_id: ventaData.cliente_id,
        usuario_id: ventaData.usuario_id,
        items: (ventaData.itemsAgregados || []).map((item) => ({
          producto_id: item.productoId || item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.total,
        })),
        subtotal: parseFloat(ventaData.totalSinDescuento) || 0,
        descuento: ventaData.descuento || 0,
        total: parseFloat(ventaData.totalConDescuento) || 0,
        forma_pago: ventaData.forma_pago || null,
        fecha_hora: ventaData.fecha_hora,
        numero_factura: ventaData.numero_factura,
      };

      const response = await axios.post(`${API}/ventas`, payload);
      if (response.status === 201) {
        const responseVentas = await axios.get(`${API}/ventas`, {
          params: { page: 1, pageSize: 8, search: "" },
        });
        if (responseVentas.status === 200) {
          dispatch(getVentas(responseVentas.data));
        }
        Swal.fire({
          icon: "success",
          title: "Factura creada",
          text: "La factura se ha creado correctamente.",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data?.mensaje || "Conflicto en la operación",
        });
      } else if (error.response && error.response.status) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data?.mensaje || `Error ${error.response.status}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor.",
        });
      }
    }
  };
};

export default ventasSlice.reducer;
