import { createSlice } from "@reduxjs/toolkit";

const itemDataSlice = createSlice({
  name: "item",
  initialState: {},
  reducers: {
    getItems: (state, action) => {
      return {
        ...state,
        initialState: action.payload,
      };
    },
    addItem: (state, action) => {
      return {
        ...state,
        initialState: [action.payload, ...state.initialState],
      };
    },
  },
});
export const { getItems, addItem } = itemDataSlice.actions;

export const getItemsAPI = () => {
  return async (dispatch) => {
    try {
      dispatch(getItems());
    } catch (error) {
      console.error("Error al obtener items:", error);
    }
  };
};
export const addItemAPI = (itemData) => {
  return async (dispatch) => {
    try {
      dispatch(addItem(itemData));
    } catch (error) {}
  };
};
export default itemDataSlice.reducer;
