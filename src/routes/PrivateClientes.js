// PrivateGeneralRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRouteClientes = ({ redirect = "/productos" }) => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  if (logged.sesion[0].permisos.includes("gestion_clientes")) {
    return <Outlet context={{ logged }} />;
  } else {
    Swal.fire({
      icon: "warning",
      title: "Permiso denegado",
      text: "Su rol no le permite acceder a la pantalla de Clientes",
    });
    return <Navigate to={redirect} replace />;
  }
};

export default PrivateRouteClientes;
