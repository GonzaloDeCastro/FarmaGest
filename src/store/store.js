import { configureStore } from "@reduxjs/toolkit";
import productoDataSlice from "../redux/productosSlice";
import usuarioDataSlice from "../redux/usuariosSlice";
import proveedorDataSlice from "../redux/proveedoresSlice";

export default configureStore({
  reducer: {
    producto: productoDataSlice,
    usuario: usuarioDataSlice,
    proveedor: proveedorDataSlice,
  },
});
