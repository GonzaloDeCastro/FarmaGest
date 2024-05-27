import { configureStore } from "@reduxjs/toolkit";
import productosReducer from "../redux/productosSlice";
import usuarioReducer from "../redux/usuariosSlice";

export default configureStore({
  reducer: {
    producto: productosReducer,
    usuario: usuarioReducer,
  },
});
