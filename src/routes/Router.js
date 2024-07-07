import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../shared/Layout";
import FormLogin from "../components/login/FormLogin";
import Ventas from "../components/Ventas/Ventas";
import { useState } from "react";
import Products from "../components/Productos/Products";
import Usuarios from "../components/Usuarios/Usuarios";
import Proveedores from "../components/Proveedores/Proveedores";
import Clientes from "../components/Clientes/Clientes";
import ObrasSociales from "../components/ObrasSociales/ObrasSociales";
import Pedidos from "../components/Pedidos/Pedidos";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        {/* Ruta pública para el formulario de inicio de sesión */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/productos" />
            ) : (
              <FormLogin setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Rutas privadas */}
        <Route
          path="/pedidos"
          element={
            isLoggedIn ? (
              <Layout title={"pedidos"}>
                <Pedidos />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/proveedores"
          element={
            isLoggedIn ? (
              <Layout title={"proveedores"}>
                <Proveedores />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/ventas"
          element={
            isLoggedIn ? (
              <Layout title={"ventas"}>
                <Ventas />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/clientes"
          element={
            isLoggedIn ? (
              <Layout title={"clientes"}>
                <Clientes />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/productos"
          element={
            isLoggedIn ? (
              <Layout title={"productos"}>
                <Products />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/usuarios"
          element={
            isLoggedIn ? (
              <Layout title={"usuarios"}>
                <Usuarios />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/obras-sociales"
          element={
            isLoggedIn ? (
              <Layout title={"obras-sociales"}>
                <ObrasSociales />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
