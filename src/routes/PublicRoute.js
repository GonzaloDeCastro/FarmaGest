// PublicGeneralRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = ({ redirect = "/" }) => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  if (logged === null) {
    return <Outlet />;
  } else {
    return <Navigate to={redirect} replace />;
  }
};

export default PublicRoute;
