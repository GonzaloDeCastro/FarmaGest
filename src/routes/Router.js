import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../shared/Layout";
import FormLogin from "../components/login/FormLogin";
import Ventas from "../components/Ventas/Ventas";
import Products from "../components/Productos/Products";
import Usuarios from "../components/Usuarios/Usuarios";
import Proveedores from "../components/Proveedores/Proveedores";
import Clientes from "../components/Clientes/Clientes";
import ObrasSociales from "../components/ObrasSociales/ObrasSociales";
import Pedidos from "../components/Pedidos/Pedidos";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteVentas from "./PrivateVentas";
import PrivateRouteProveedores from "./PrivateProveedores";
import PrivateRoutePedidos from "./PrivatePedidos";
import PrivateRouteClientes from "./PrivateClientes";
import PrivateRouteUsuarios from "./PrivateUsuarios";
import PrivateRouteObrasSociales from "./PrivateObrasSociales";

const AppRouter = () => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  return (
    <Router>
      <Routes>
        {/* Ruta pública para el formulario de inicio de sesión */}
        <Route element={<PublicRoute logged={logged} />}>
          <Route path="/login" element={<FormLogin />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute logged={logged} />}>
          <Route element={<PrivateRoutePedidos logged={logged} />}>
            <Route
              path="/pedidos"
              element={
                <Layout title={"pedidos"}>
                  <Pedidos />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteProveedores logged={logged} />}>
            <Route
              path="/proveedores"
              element={
                <Layout title={"proveedores"}>
                  <Proveedores />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteVentas logged={logged} />}>
            <Route
              path="/ventas"
              element={
                <Layout title={"ventas"}>
                  <Ventas />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteClientes logged={logged} />}>
            <Route
              path="/clientes"
              element={
                <Layout title={"clientes"}>
                  <Clientes />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/productos"
            element={
              <Layout title={"productos"}>
                <Products />
              </Layout>
            }
          />
          <Route element={<PrivateRouteUsuarios logged={logged} />}>
            <Route
              path="/usuarios"
              element={
                <Layout title={"usuarios"}>
                  <Usuarios />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteObrasSociales logged={logged} />}>
            <Route
              path="/obras-sociales"
              element={
                <Layout title={"obras-sociales"}>
                  <ObrasSociales />
                </Layout>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
