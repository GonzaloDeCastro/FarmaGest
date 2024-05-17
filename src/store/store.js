import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../redux/productsSlice";
import userReducer from "../redux/usuariosSlice";

export default configureStore({
  reducer: {
    product: productsReducer,
    user: userReducer,
  },
});
