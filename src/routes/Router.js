import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../shared/Layout";
import FormLogin from "../components/login/FormLogin";
import Home from "../components/Home/Home";
import Sales from "../components/Sales/Sales";
import Settings from "../components/Settings/Setting";
import Users from "../components/Users/Users";
import { useState } from "react";
import Products from "../components/Products/Products";

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
          path="/sales"
          element={
            isLoggedIn ? (
              <Layout title={"sales"}>
                <Sales />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/products"
          element={
            isLoggedIn ? (
              <Layout title={"products"}>
                <Products />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isLoggedIn ? (
              <Layout title={"users"}>
                <Users />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isLoggedIn ? (
              <Layout title={"settings"}>
                <Settings />
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
