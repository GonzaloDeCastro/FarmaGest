/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addUsuarioAPI } from "../../redux/usuariosSlice";
import { useDispatch } from "react-redux";

const UsuarioFormModal = ({ Roles }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [roleID, setRoleID] = useState(0);
  const [roleDesc, setRoleDesc] = useState("");
  const [emailError, setEmailError] = useState(true);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [signInvalidEmail, setSignInvalidEmail] = useState("none");
  const [signInvalidPassword, setSignInvalidPassword] = useState("none");
  const [signDifferentPassword, setSignDifferentPassword] = useState("none");
  const [passwordError, setPasswordError] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddUsuario = () => {
    if (
      emailError == false &&
      passwordError == false &&
      password == repeatPassword
    ) {
      try {
        dispatch(
          addUsuarioAPI({
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            rol_id: roleID == 0 ? null : parseInt(roleID),
            Rol: roleDesc,
            contrasena: password,
          })
        );
        handleClose();
        setRoleID(0);
        setNombre("");
        setApellido("");
        setCorreo("");
        setRoleDesc("");
      } catch {}
    } else {
      if (emailError == true) {
        setSignInvalidEmail("block");
      } else {
        setSignInvalidEmail("none");
      }
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

  const handleChange = (e) => {
    setRoleID(e.target.value);
    const selectedCompaniaDesc =
      e.target.selectedOptions[0].getAttribute("data-user-role");
    setRoleDesc(selectedCompaniaDesc);
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setCorreo(value);

    // Expresión regular para validar el formato del correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
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

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Agregar Usuario</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                usuario_id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                usuario_id="apellido"
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                usuario_id="correo"
                className="form-control"
                value={correo}
                onChange={handleChangeEmail}
              />{" "}
              <p
                style={{
                  display: `${signInvalidEmail}`,
                  marginTop: "5px",
                  color: "#b70f0a",
                  fontWeight: "bold",
                }}
              >
                Correo inválido
              </p>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="userName">Password:</label>
                <input
                  maxLength="50"
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={handleChangePassword}
                />
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="userName">Repetir Password:</label>
                <input
                  maxLength="50"
                  type="password"
                  id="repeatPassword"
                  className="form-control"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <p
                style={{
                  display: `${signInvalidPassword}`,
                  marginTop: "5px",
                  color: "#b70f0a",
                  fontWeight: "bold",
                }}
              >
                La contraseña debe tener al menos 12 caracteres, contener al
                menos un número y tener al menos una letra mayúscula y una
                minúscula.
              </p>
              <p
                style={{
                  display: `${signDifferentPassword}`,
                  marginTop: "5px",
                  color: "#b70f0a",
                  fontWeight: "bold",
                }}
              >
                Las passwords no coinciden
              </p>
            </div>
          </div>
          <div className="form-group col-md-12">
            <label htmlFor="roleID">Roles:</label>
            <select
              value={roleID}
              className="form-select"
              onChange={handleChange}
            >
              <option value="" className="default-option">
                Seleccionar rol
              </option>
              {Roles?.map((rol) => (
                <option
                  key={rol.rol_id}
                  value={rol.rol_id}
                  data-user-role={rol.rol}
                >
                  {rol.rol.charAt(0).toUpperCase() + rol.rol.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonConfirm" onClick={handleAddUsuario}>
            <FaSave className="iconConfirm" />
            Confirmar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsuarioFormModal;
