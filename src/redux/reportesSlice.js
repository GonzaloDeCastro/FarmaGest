// En redux/reportesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const reportesSlice = createSlice({
  name: "reportes",
  initialState: {},
  reducers: {
    getVentas: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
  },
});

export const { getVentas } = reportesSlice.actions;

export const getReportesAPI = (page, pageSize, search) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/ventas`, {
      params: { page, pageSize, search },
    });
    if (response.status === 200) {
      dispatch(getVentas(response.data));
    }
  } catch (error) {
    console.error("Error al obtener ventas:", error);
  }
};

export default reportesSlice.reducer;
