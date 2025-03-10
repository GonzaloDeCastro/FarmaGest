// PrivateGeneralRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRoutePedidos = ({ redirect = "/" }) => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  if (logged !== null && logged.sesion.permisos.includes("gestion_pedidos")) {
    return <Outlet context={{ logged }} />;
  } else {
    Swal.fire({
      icon: "warning",
      title: "Permiso denegado",
      text: "Su rol no le permite acceder a la pantalla de Pedidos",
    });
    return <Navigate to={redirect} replace />;
  }
};

export default PrivateRoutePedidos;
