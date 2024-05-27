import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../shared/Layout";
import FormLogin from "../components/login/FormLogin";
import Home from "../components/Home/Home";
import Ventas from "../components/Ventas/Ventas";
import Config from "../components/Config/Config";
import { useState } from "react";
import Products from "../components/Productos/Products";
import Usuarios from "../components/Usuarios/Usuarios";

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
              <Navigate to="/home" />
            ) : (
              <FormLogin setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Rutas privadas */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Layout title={"home"}>
                <Home />
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
          path="/config"
          element={
            isLoggedIn ? (
              <Layout title={"config"}>
                <Config />
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
