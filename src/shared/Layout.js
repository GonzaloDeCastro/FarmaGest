import React, { useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../imgs/logoNav.png";
import Section from "./Section";
import { Link } from "react-router-dom";
import { FaBoxArchive, FaGear } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { FaBell, FaHome, FaUserCircle, FaShoppingCart } from "react-icons/fa";

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
                  case "users":
                    return "Users";
                  case "settings":
                    return "Settings";
                  case "sales":
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

          <Link to="/sales">
            <FaShoppingCart className="iconMenu" />
          </Link>
          <Link to="/products">
            <FaBoxArchive className="iconMenu" />
          </Link>
          <Link to="/users">
            <HiUsers className="iconMenu" />
          </Link>

          <Link to="/settings">
            <FaGear className="iconMenu" />
          </Link>
        </nav>

        <nav className={isOpen ? "bigActive" : "bigInactive"}>
          <Link className="itemMenu" to="/home">
            <FaHome className="iconMenu" />
            <span>Home</span>
          </Link>
          <Link className="itemMenu" to="/sales">
            <FaShoppingCart className="iconMenu" />
            <span>Sales</span>
          </Link>
          <Link className="itemMenu" to="/products">
            <FaBoxArchive className="iconMenu" />
            <span>Products</span>
          </Link>
          <Link className="itemMenu" to="/users">
            <HiUsers className="iconMenu" />
            <span>Users/Roles</span>
          </Link>

          <Link className="itemMenu" to="/settings">
            <FaGear className="iconMenu" />
            <span>Settings</span>
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
