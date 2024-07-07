import React, { useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../imgs/logoNav.png";
import Section from "./Section";
import { Link } from "react-router-dom";
import { FaHandshake } from "react-icons/fa6";
import { LiaAddressCardSolid } from "react-icons/lia";
import { AiFillProduct } from "react-icons/ai";
import { RiShoppingBag4Fill } from "react-icons/ri";

import { HiUsers } from "react-icons/hi";
import { FaBell, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";

const Layout = ({ children, title }) => {
  console.log("llega algo? ", title);
  const [isOpen, setOpen] = useState(false);
  function capitalizeFirstLetter(value) {
    console.log("value llega ", value);
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }

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
            <FaUserCircle className="iconUser" />
          </div>
        </div>
      </header>
      <div className="bodyContainer">
        <nav className={!isOpen ? "smallActive" : "smallInactive"}>
          <Link to="/pedidos">
            <RiShoppingBag4Fill className="iconMenu" />
          </Link>
          <Link to="/proveedores">
            <ImUserTie className="iconMenu" />
          </Link>
          <Link to="/ventas">
            <FaShoppingCart className="iconMenu" />
          </Link>
          <Link to="/clientes">
            <FaHandshake className="iconMenu" />
          </Link>
          <Link to="/obras-sociales">
            <LiaAddressCardSolid className="iconMenu" />
          </Link>
          <Link to="/productos">
            <AiFillProduct className="iconMenu" />
          </Link>
          <Link to="/usuarios">
            <HiUsers className="iconMenu" />
          </Link>
        </nav>

        <nav className={isOpen ? "bigActive" : "bigInactive"}>
          <Link className="itemMenu" to="/pedidos">
            <RiShoppingBag4Fill className="iconMenu" />
            <span>Pedidos</span>
          </Link>
          <Link className="itemMenu" to="/proveedores">
            <ImUserTie className="iconMenu" />
            <span>Proveedores</span>
          </Link>
          <Link className="itemMenu" to="/ventas">
            <FaShoppingCart className="iconMenu" />
            <span>Ventas</span>
          </Link>
          <Link className="itemMenu" to="/clientes">
            <FaHandshake className="iconMenu" />
            <span>Clientes</span>
          </Link>
          <Link className="itemMenu" to="/obras-sociales">
            <LiaAddressCardSolid className="iconMenu" />
            <span>Obras Sociales</span>
          </Link>
          <Link className="itemMenu" to="/productos">
            <AiFillProduct className="iconMenu" />
            <span>Productos</span>
          </Link>
          <Link className="itemMenu" to="/usuarios">
            <HiUsers className="iconMenu" />
            <span>Usuarios</span>
          </Link>
        </nav>

        <section>
          <Section container={children} />
        </section>
      </div>
    </div>
  );
};

export default Layout;
