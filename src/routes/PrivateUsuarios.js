// PrivateGeneralRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRouteUsuarios = ({ redirect = "/" }) => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  if (logged !== null && logged.sesion.permisos.includes("gestion_usuarios")) {
    return <Outlet context={{ logged }} />;
  } else {
    Swal.fire({
      icon: "warning",
      title: "Permiso denegado",
      text: "Necesita rol administrdaor para acceder a este módulo",
    });
    return <Navigate to={redirect} replace />;
  }
};

export default PrivateRouteUsuarios;
