import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const initialState = {
  loading: false,
  error: null,
  resumen: [],
  totales: {
    cantidad_ventas: 0,
    subtotal_total: 0,
    descuento_total: 0,
    total_paciente: 0,
    aporte_obra_social: 0,
  },
  filtros: {
    obraSocialId: null,
    fechaDesde: null,
    fechaHasta: null,
    incluirSinObraSocial: false,
  },
  totalRegistros: 0,
  emailSending: false,
  emailError: null,
  emailSuccess: null,
};

const liquidacionObrasSocialesSlice = createSlice({
  name: "liquidacionObrasSociales",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.resumen = action.payload?.resumen || [];
      state.totales = action.payload?.totales || initialState.totales;
      state.filtros = action.payload?.filtros || initialState.filtros;
      state.totalRegistros = action.payload?.totalRegistros || 0;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error al cargar liquidación";
    },
    sendEmailStart: (state) => {
      state.emailSending = true;
      state.emailError = null;
      state.emailSuccess = null;
    },
    sendEmailSuccess: (state, action) => {
      state.emailSending = false;
      state.emailError = null;
      state.emailSuccess =
        action.payload?.mensaje || "Liquidación enviada correctamente.";
    },
    sendEmailFailure: (state, action) => {
      state.emailSending = false;
      state.emailError =
        action.payload || "Error al enviar la liquidación por correo.";
    },
    reset: () => ({
      ...initialState,
    }),
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  sendEmailStart,
  sendEmailSuccess,
  sendEmailFailure,
  reset,
} =
  liquidacionObrasSocialesSlice.actions;

export const fetchLiquidacionObrasSocialesAPI =
  (filters = {}) =>
  async (dispatch) => {
    try {
      dispatch(fetchStart());

      const params = {};

      if (filters.obraSocialId) {
        params.obraSocialId = filters.obraSocialId;
      }

      if (filters.fechaDesde) {
        params.fechaDesde = filters.fechaDesde;
      }

      if (filters.fechaHasta) {
        params.fechaHasta = filters.fechaHasta;
      }

      if (filters.incluirSinObraSocial) {
        params.incluirSinObraSocial = filters.incluirSinObraSocial;
      }

      const response = await axios.get(
        `${API}/auditoria-obras-sociales/liquidacion`,
        { params }
      );

      dispatch(fetchSuccess(response.data || {}));
    } catch (error) {
      console.error("Error al obtener liquidación de obras sociales:", error);
      dispatch(
        fetchFailure(
          error?.response?.data?.mensaje || "No se pudo obtener la liquidación"
        )
      );
    }
  };

export const sendLiquidacionObrasSocialesEmailAPI =
  (payload = {}) =>
  async (dispatch) => {
    try {
      dispatch(sendEmailStart());

      const response = await axios.post(
        `${API}/auditoria-obras-sociales/liquidacion/email`,
        payload
      );

      dispatch(sendEmailSuccess(response.data || {}));
      return response.data;
    } catch (error) {
      console.error("Error al enviar liquidación de obras sociales:", error);
      const mensaje =
        error?.response?.data?.mensaje ||
        "No se pudo enviar la liquidación por correo";
      dispatch(sendEmailFailure(mensaje));
      throw error;
    }
  };

export const resetLiquidacionObrasSociales = () => (dispatch) => {
  dispatch(reset());
};

export default liquidacionObrasSocialesSlice.reducer;

