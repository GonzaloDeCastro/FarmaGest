import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { MdOutlineExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

import {
  logoutUsuario,
  updatePasswordDataAPI,
} from "../../redux/usuariosSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const UsuarioLogout = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setShowfieldsPassword(false);
  };
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showfieldsPassword, setShowfieldsPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState(true);
  const [signInvalidPassword, setSignInvalidPassword] = useState("none");
  const [signDifferentPassword, setSignDifferentPassword] = useState("none");
  const [disableButton, setDisableButton] = useState(true);
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  const handleLogout = () => {
    sessionStorage.removeItem("logged");
    dispatch(logoutUsuario());

    navigate(`/login`);
  };
  const handleCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);

    // Expresiones regulares para validar la contraseña
    const minLength = 12;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;

    // Verificar si la contraseña cumple con los criterios
    const isValidPassword =
      value.length >= minLength &&
      hasNumber.test(value) &&
      hasUpperCase.test(value);

    if (!isValidPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const checkFields = () => {
    if (
      password.trim() !== "" &&
      currentPassword.trim() !== "" &&
      repeatPassword.trim() !== ""
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };

  useEffect(() => {
    checkFields();
  }, [password, repeatPassword, currentPassword]);
  const handleShowFields = () => {
    setShowfieldsPassword(!showfieldsPassword);
    setCurrentPassword("");
    setPassword("");
    setRepeatPassword("");
    setSignInvalidPassword("none");
    setSignDifferentPassword("none");
  };

  console.log("logged.sesion[0] ", logged.sesion[0].correo);
  const handleUpdatePassword = async () => {
    if (passwordError == false && password == repeatPassword) {
      try {
        let correo = logged.sesion[0].correo;
        dispatch(updatePasswordDataAPI({ correo, currentPassword, password }));
        // Clean form
        setCurrentPassword("");
        setPassword("");
        setRepeatPassword("");
        handleClose();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error update password. Please, try again",
        });
      }
    } else {
      if (passwordError == true) {
        setSignInvalidPassword("block");
      } else {
        setSignInvalidPassword("none");
        if (password != repeatPassword) {
          setSignDifferentPassword("block");
        } else {
          setSignDifferentPassword("none");
        }
      }
    }
  };

  return (
    <>
      <FaUserCircle className="iconUser" onClick={handleShow} />
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                width: "60%",
                fontSize: "1.3rem",
              }}
            >
              <div>
                <strong>User: </strong>
                {`${logged?.sesion[0]?.nombre} ${logged?.sesion[0]?.apellido}`}
              </div>
              <div>
                <strong>Rol: </strong>
                {logged?.sesion[0]?.rol}
              </div>
              <div>
                <strong>Correo: </strong>
                {logged?.sesion[0]?.correo}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                width: "40%",
              }}
            >
              <FaUserCircle
                style={{ width: "100px", height: "100px", color: "#60635f" }}
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "0px",
          }}
        >
          <div className="itemProfile" onClick={handleShowFields}>
            Change Password
          </div>
          {showfieldsPassword && (
            <>
              <div className="form-group" style={{ width: "90%" }}>
                <label htmlFor="userName">Current Password:</label>
                <input
                  maxLength="50"
                  type="password"
                  id="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={handleCurrentPassword}
                />
              </div>

              <div className="form-group" style={{ width: "90%" }}>
                <label htmlFor="userName">New Password:</label>
                <input
                  maxLength="50"
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={handleChangePassword}
                />
              </div>

              <div className="form-group" style={{ width: "90%" }}>
                <label htmlFor="userName">Repeat Password:</label>
                <input
                  maxLength="50"
                  type="password"
                  id="repeatPassword"
                  className="form-control"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />

                <p
                  style={{
                    display: `${signInvalidPassword}`,
                    marginTop: "5px",
                    color: "#b70f0a",
                    fontWeight: "bold",
                  }}
                >
                  Password must be at least 12 characters long, contain at least
                  one number, and have at least one uppercase and one lowercase
                  letter
                </p>
                <p
                  style={{
                    display: `${signDifferentPassword}`,
                    marginTop: "5px",
                    color: "#b70f0a",
                    fontWeight: "bold",
                  }}
                >
                  Passwords are not the same
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {showfieldsPassword ? (
            <Button
              style={{ padding: "10px" }}
              disabled={disableButton}
              onClick={() => handleUpdatePassword()}
            >
              Confirm{" "}
              <FaCheck
                style={{
                  width: "20px",
                  height: "20px",

                  marginLeft: "10px",
                }}
              />
            </Button>
          ) : (
            <Button onClick={handleLogout}>
              Salir
              <MdOutlineExitToApp
                style={{ width: "30px", height: "30px", marginLeft: "10px" }}
              />
            </Button>
          )}

          <Button variant="danger" onClick={handleClose}>
            Cerrar
            <IoIosClose style={{ width: "30px", height: "30px" }} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsuarioLogout;
