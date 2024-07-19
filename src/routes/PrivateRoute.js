// PrivateGeneralRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ redirect = "/login" }) => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  if (logged) {
    return <Outlet context={{ logged }} />;
  } else {
    sessionStorage.removeItem("logged");
    return <Navigate to={redirect} replace />;
  }
};

export default PrivateRoute;
