import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addUsuarioDataAPI, getRolesDataAPI } from "../../redux/usuariosSlice";

import { useDispatch, useSelector } from "react-redux";

const UsuarioFormModal = ({ Users }) => {
  const dispatch = useDispatch();
  const Roles = useSelector((state) => state && state?.usuario?.rolesState);

  console.log("Roles ", Roles);

  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [roleID, setRoleID] = useState(0);

  const [roleDesc, setRoleDesc] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddUsuario = () => {
    try {
      dispatch(
        addUsuarioDataAPI({
          nombre: nombre,
          apellido: apellido,
          correo_electronico: correo,
          role_id: roleID === 0 ? null : roleID,
          descripcion: roleDesc,
        })
      );
      handleClose();
      setRoleID(0);
      setNombre("");
      setApellido("");
      setCorreo("");
      setRoleDesc("");
    } catch {}
  };

  const handleChange = (e) => {
    setRoleID(e.target.value);
    const selectedCompaniaDesc =
      e.target.selectedOptions[0].getAttribute("data-user-role");
    setRoleDesc(selectedCompaniaDesc);
  };
  useEffect(() => {
    dispatch(getRolesDataAPI());
  }, [dispatch]);

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
            <div className="form-group col-md-6">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                usuario_id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                usuario_id="apellido"
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                usuario_id="correo"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group col-md-6">
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
                  data-user-role={rol.descripcion}
                >
                  {rol.descripcion.charAt(0).toUpperCase() +
                    rol.descripcion.slice(1)}
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
