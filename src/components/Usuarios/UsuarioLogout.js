import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { MdOutlineExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
  logoutUsuario,
  updatePasswordDataAPI,
} from "../../redux/usuariosSlice";

const UsuarioLogout = () => {
  const [show, setShow] = useState(false);
  const [showfieldsPassword, setShowfieldsPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signInvalidPassword, setSignInvalidPassword] = useState(false);
  const [signDifferentPassword, setSignDifferentPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  const handleClose = () => {
    setShow(false);
    setShowfieldsPassword(false);
    reset();
  };
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    sessionStorage.removeItem("logged");
    dispatch(logoutUsuario());
    navigate(`/login`);
  };

  const handleUpdatePassword = async (data) => {
    const { currentPassword, password, repeatPassword } = data;
    if (passwordError === false && password === repeatPassword) {
      try {
        const correo = logged.sesion.correo;
        dispatch(updatePasswordDataAPI({ correo, currentPassword, password }));
        // Clean form
        reset();
        handleClose();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error updating password. Please, try again",
        });
      }
    } else {
      if (passwordError) {
        setSignInvalidPassword(true);
      } else {
        setSignInvalidPassword(false);
        if (password !== repeatPassword) {
          setSignDifferentPassword(true);
        } else {
          setSignDifferentPassword(false);
        }
      }
    }
  };

  const validatePassword = (value) => {
    const minLength = 12;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const isValidPassword =
      value.length >= minLength &&
      hasNumber.test(value) &&
      hasUpperCase.test(value);
    setPasswordError(!isValidPassword);
    return isValidPassword;
  };

  const watchPassword = watch("password");

  useEffect(() => {
    setSignInvalidPassword(passwordError);

    // Obtiene los valores de password y repeatPassword utilizando la función watch de react-hook-form
    const password = watch("password");
    const repeatPassword = watch("repeatPassword");

    // Verifica si ambos campos tienen la misma longitud y luego si son iguales
    if (
      password &&
      repeatPassword &&
      password.length === repeatPassword.length
    ) {
      setSignDifferentPassword(password !== repeatPassword);
    } else {
      // Puede optar por no hacer nada o establecer específicamente setSignDifferentPassword a false si no se cumple la condición de longitud
      setSignDifferentPassword(false);
    }
  }, [passwordError, watchPassword, watch]);

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
                color: "#000",
              }}
            >
              <div>
                <strong>User: </strong>
                {`${logged?.sesion?.nombre} ${logged?.sesion?.apellido}`}
              </div>
              <div>
                <strong>Rol: </strong>
                {logged?.sesion?.rol}
              </div>
              <div>
                <strong>Correo: </strong>
                {logged?.sesion?.correo}
              </div>
            </div>
            <div style={{ textAlign: "center", width: "40%" }}>
              <FaUserCircle
                style={{ width: "120px", height: "120px", color: "#000" }}
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
          <div
            className="itemProfile"
            onClick={() => setShowfieldsPassword(!showfieldsPassword)}
          >
            Cambiar Password
          </div>
          {showfieldsPassword && (
            <form
              onSubmit={handleSubmit(handleUpdatePassword)}
              autoComplete="off"
              style={{ width: "90%" }}
            >
              <label htmlFor="currentPassword">Password Actual:</label>
              <input
                maxLength="50"
                type="password"
                id="currentPassword"
                className="form-control"
                {...register("currentPassword", { required: true })}
                autoComplete="new-password"
              />
              {errors.currentPassword && <p>Este campo es requerido</p>}

              <label htmlFor="password">Nuevo Password:</label>
              <input
                maxLength="50"
                type="password"
                id="password"
                className="form-control"
                {...register("password", {
                  required: true,
                  validate: validatePassword,
                })}
                autoComplete="new-password"
              />
              {errors.password && <p>Este campo es requerido</p>}

              <label htmlFor="repeatPassword">Repetir Password:</label>
              <input
                maxLength="50"
                type="password"
                id="repeatPassword"
                className="form-control"
                {...register("repeatPassword", {
                  required: true,
                  validate: (value) => value === watchPassword,
                })}
                autoComplete="new-password"
              />
              {errors.repeatPassword && <p>Las contraseñas no coinciden</p>}

              {signInvalidPassword && (
                <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                  La contraseña debe tener al menos 12 caracteres, contener al
                  menos un número y tener al menos una letra mayúscula
                </p>
              )}
              {signDifferentPassword && (
                <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                  Las contraseñas no coinciden
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                {" "}
                <Button
                  variant="danger"
                  onClick={() => setShowfieldsPassword(!showfieldsPassword)}
                >
                  Volver
                  <IoIosClose style={{ width: "30px", height: "30px" }} />
                </Button>
                <Button
                  type="submit"
                  disabled={
                    passwordError || watchPassword != watch("repeatPassword")
                  }
                  style={{ marginLeft: "10px" }}
                >
                  Confirmar
                  <FaCheck
                    style={{
                      width: "20px",
                      height: "20px",
                      marginLeft: "10px",
                    }}
                  />
                </Button>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!showfieldsPassword && (
            <>
              {" "}
              <Button variant="danger" onClick={handleClose}>
                Cerrar
                <IoIosClose style={{ width: "30px", height: "30px" }} />
              </Button>
              <Button onClick={handleLogout}>
                Logout
                <MdOutlineExitToApp
                  style={{ width: "30px", height: "30px", marginLeft: "10px" }}
                />
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsuarioLogout;
