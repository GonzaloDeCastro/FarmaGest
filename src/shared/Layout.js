import React, { useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../imgs/logoNav.png";
import Section from "./Section";
import { Link } from "react-router-dom";
import { FaHandshake } from "react-icons/fa6";
import { LiaAddressCardSolid } from "react-icons/lia";
import { AiFillProduct } from "react-icons/ai";
import { IoBarChart } from "react-icons/io5";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { FaBell, FaShoppingCart } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";
import UsuarioLogout from "../components/Usuarios/UsuarioLogout";

const Layout = ({ children, title }) => {
  const [isOpen, setOpen] = useState(false);
  function capitalizeFirstLetter(value) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  const permisos = logged.sesion.permisos;

  return (
    <div className="containerGeneralAPP">
      <header>
        <div
          style={{
            backgroundColor: "#000",
            color: "#abd34e",

            padding: "12px",
          }}
        >
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <div className="headerContainer">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <img className="logo" src={logo} alt="logo" />
            </div>
            <div
              style={{
                fontSize: "2em",
                fontWeight: "bold",
                marginLeft: "20px",
                color: "#abd34e",
              }}
            >
              {title === undefined
                ? "productos"
                : (() => {
                    switch (title) {
                      case "obras-sociales":
                        return "Obras Sociales";
                      default:
                        return capitalizeFirstLetter(title);
                    }
                  })()}
            </div>
          </div>
          <div>
            <FaBell className="iconUser" />

            <UsuarioLogout />
          </div>
        </div>
      </header>
      <div className="bodyContainer">
        <nav className={!isOpen ? "smallActive" : "smallInactive"}>
          {permisos.includes(
            "gestion_pedidos" && logged.sesion.rol !== "admin"
          ) && (
            <Link to="/pedidos">
              <RiShoppingBag4Fill className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_proveedores") && (
            <Link to="/proveedores">
              <ImUserTie className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_ventas") && (
            <Link to="/ventas">
              <FaShoppingCart className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_clientes") && (
            <Link to="/clientes">
              <FaHandshake className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_obras_sociales") && (
            <Link to="/obras-sociales">
              <LiaAddressCardSolid className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_productos") && (
            <Link to="/">
              <AiFillProduct className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link to="/usuarios">
              <HiUsers className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link to="/reportes">
              <IoBarChart className="iconMenu" />
            </Link>
          )}
        </nav>

        <nav className={isOpen ? "bigActive" : "bigInactive"}>
          {permisos.includes("gestion_pedidos") &&
            logged.sesion.rol !== "admin" && (
              <Link className="itemMenu" to="/pedidos">
                <RiShoppingBag4Fill className="iconMenu" />
                <span>Pedidos</span>
              </Link>
            )}
          {permisos.includes("gestion_proveedores") && (
            <Link className="itemMenu" to="/proveedores">
              <ImUserTie className="iconMenu" />
              <span>Proveedores</span>
            </Link>
          )}
          {permisos.includes("gestion_ventas") && (
            <Link className="itemMenu" to="/ventas">
              <FaShoppingCart className="iconMenu" />
              <span>Ventas</span>
            </Link>
          )}
          {permisos.includes("gestion_clientes") && (
            <Link className="itemMenu" to="/clientes">
              <FaHandshake className="iconMenu" />
              <span>Clientes</span>
            </Link>
          )}
          {permisos.includes("gestion_obras_sociales") && (
            <Link className="itemMenu" to="/obras-sociales">
              <LiaAddressCardSolid className="iconMenu" />
              <span>Obras Sociales</span>
            </Link>
          )}
          {permisos.includes("gestion_productos") && (
            <Link className="itemMenu" to="/">
              <AiFillProduct className="iconMenu" />
              <span>Productos</span>
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link className="itemMenu" to="/usuarios">
              <HiUsers className="iconMenu" />
              <span>Usuarios</span>
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link className="itemMenu" to="/reportes">
              <IoBarChart className="iconMenu" />
              <span>Reportes</span>
            </Link>
          )}
        </nav>

        <section>
          <Section container={children} />
        </section>
      </div>
    </div>
  );
};

export default Layout;
