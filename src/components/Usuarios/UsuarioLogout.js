import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { logoutUsuario } from "../../redux/usuariosSlice";
import { useDispatch } from "react-redux";

const UsuarioLogout = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  const handleLogout = () => {
    sessionStorage.removeItem("logged");
    dispatch(logoutUsuario());

    navigate(`/login`);
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
                {`${logged?.sesion?.nombre} ${logged?.sesion?.apellido}`}
              </div>
              <div>
                <strong>Rol: </strong>
                {logged?.sesion?.rol_desc}
              </div>
              <div>
                <strong>Correo: </strong>
                {logged?.sesion?.correo}
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
        ></Modal.Body>
        <Modal.Footer>
          <Button onClick={handleLogout}>
            Salir
            <MdOutlineExitToApp
              style={{ width: "30px", height: "30px", marginLeft: "10px" }}
            />
          </Button>

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
