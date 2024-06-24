import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";
import Swal from "sweetalert2";
const sesionDataSlice = createSlice({
  name: "sesionData",
  initialState: [],
  loginState: [],
  reducers: {
    getSesionData: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    getLoginData: (state, action) => {
      return {
        ...state,
        loginState: action.payload,
      };
    },
  },
});

export const { getSesionData, getLoginData } = sesionDataSlice.actions;

export const getSesionDataAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}sesion/all`);

      if (response?.status === 200) {
        const action = getSesionData(response?.data?.results);
        dispatch(action);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export const logoutSesionDataAPI = (sesionId, lastActivity) => {
  const lastActivityData = { lastActivity: lastActivity && lastActivity };
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}sesion/${sesionId}`,
        lastActivityData
      );
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export const getLoginDataAPI = (dataLogin) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}sesion/get-login`, {
        params: {
          dataLogin: dataLogin,
        },
      });
      if (response?.status === 200) {
        const action = response?.data;

        if (action !== 1) {
          const { user_id, role_id, is_active } = action;

          if (is_active) {
            const { password, ...dataWithoutPassword } = dataLogin;
            const NewSesion = { ...dataWithoutPassword, user_id: user_id };
            if (role_id != 8) {
              const response2 = await axios.post(`${API}sesion/`, NewSesion);
              if (response2?.status === 200) {
                const sesionID = getSesionData(response2.data.sesionID);
                const response3 = await axios.get(`${API}sesion/all`, {
                  params: {
                    sesion_id: sesionID,
                  },
                });
                if (response3?.status === 200) {
                  const action2 = getSesionData(response3.data.results);
                  dispatch(action2);
                }
              }
            } else {
              const SesionInLead = { ...NewSesion, selectAreaLine: true };
              const action2 = getSesionData([SesionInLead]);
              dispatch(action2);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Username inactive",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Username or Password invalid",
          });
        }
      }
    } catch (error) {}
  };
};

export const getLoginLeadDataAPI = (sesionLead) => {
  return async (dispatch) => {
    try {
      const responseLead = await axios.post(`${API}sesion/lead`, sesionLead);
      if (responseLead?.status === 200) {
        const sesionID = getSesionData(responseLead.data.sesionID);

        const responseLead2 = await axios.get(`${API}sesion/all`, {
          params: {
            sesion_id: sesionID,
          },
        });
        if (responseLead2?.status === 200) {
          const action2 = getSesionData(responseLead2.data.results);

          dispatch(action2);
        }
      }
    } catch (error) {}
  };
};

export default sesionDataSlice.reducer;
