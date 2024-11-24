import { configureStore } from "@reduxjs/toolkit";
import productoDataSlice from "../redux/productosSlice";
import usuarioDataSlice from "../redux/usuariosSlice";
import proveedorDataSlice from "../redux/proveedoresSlice";
import clienteDataSlice from "../redux/clientesSlice";
import obraSocialDataSlice from "../redux/obrasSocialesSlice";
import ventaDataSlice from "../redux/ventasSlice";
import reporteDataSlice from "../redux/reportesSlice";

export default configureStore({
  reducer: {
    venta: ventaDataSlice,
    producto: productoDataSlice,
    usuario: usuarioDataSlice,
    proveedor: proveedorDataSlice,
    cliente: clienteDataSlice,
    obrasocial: obraSocialDataSlice,
    reporte: reporteDataSlice,
  },
});
