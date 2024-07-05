import React, { useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../imgs/logoNav.png";
import Section from "./Section";
import { Link } from "react-router-dom";
import { FaBoxArchive, FaGear } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { FaBell, FaHome, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";
import { RiShakeHandsFill } from "react-icons/ri";
const Layout = ({ children, title }) => {
  const [isOpen, setOpen] = useState(false);
  function capitalizeFirstLetter(value) {
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
            <div style={{ fontSize: "2em", fontWeight: "bold" }}>
              {() => {
                switch (title) {
                  case "home":
                    return "home";
                  case "usuarios":
                    return "Users";
                  case "config":
                    return "Settings";
                  case "ventas":
                    return "Sales";
                  default:
                    return capitalizeFirstLetter(title);
                }
              }}
            </div>
            <div>
              <img className="logo" src={logo} alt="logo" />
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
          <Link to="/home">
            <FaHome className="iconMenu" />
          </Link>
          <Link to="/proveedores">
            <ImUserTie className="iconMenu" />
          </Link>
          <Link to="/ventas">
            <FaShoppingCart className="iconMenu" />
          </Link>
          <Link to="/clientes">
            <RiShakeHandsFill className="iconMenu" />
          </Link>
          <Link to="/productos">
            <FaBoxArchive className="iconMenu" />
          </Link>
          <Link to="/usuarios">
            <HiUsers className="iconMenu" />
          </Link>

          <Link to="/config">
            <FaGear className="iconMenu" />
          </Link>
        </nav>

        <nav className={isOpen ? "bigActive" : "bigInactive"}>
          <Link className="itemMenu" to="/home">
            <FaHome className="iconMenu" />
            <span>Home</span>
          </Link>
          <Link className="itemMenu" to="/home">
            <ImUserTie className="iconMenu" />
            <span>Proveedores</span>
          </Link>
          <Link className="itemMenu" to="/ventas">
            <FaShoppingCart className="iconMenu" />
            <span>Ventas</span>
          </Link>
          <Link className="itemMenu" to="/home">
            <RiShakeHandsFill className="iconMenu" />
            <span>Clientes</span>
          </Link>
          <Link className="itemMenu" to="/productos">
            <FaBoxArchive className="iconMenu" />
            <span>Productos</span>
          </Link>
          <Link className="itemMenu" to="/usuarios">
            <HiUsers className="iconMenu" />
            <span>Usuarios</span>
          </Link>

          <Link className="itemMenu" to="/config">
            <FaGear className="iconMenu" />
            <span>Configuración</span>
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
