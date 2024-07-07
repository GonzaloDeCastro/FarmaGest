/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave, FaEdit } from "react-icons/fa";
import { editUsuarioAPI } from "../../redux/usuariosSlice";
import { useDispatch } from "react-redux";

const EditUsuarioFormModal = ({ usuarioSelected, Roles }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [nombre, setNombre] = useState(usuarioSelected?.Nombre);
  const [apellido, setApellido] = useState(usuarioSelected?.Apellido);
  const [correo, setCorreo] = useState(usuarioSelected?.Correo);
  const [roleID, setRoleID] = useState(usuarioSelected?.rol_id);
  const [roleDesc, setRoleDesc] = useState(usuarioSelected?.Rol);
  const [userID, setUserID] = useState(usuarioSelected?.usuario_id);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditUsuario = () => {
    try {
      dispatch(
        editUsuarioAPI({
          usuario_id: parseInt(userID),
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          rol_id: roleID == 0 ? null : roleID,
          Rol: roleDesc,
        })
      );
      handleClose();
    } catch {}
  };

  const handleChange = (e) => {
    setRoleID(e.target.value);
    const selectedCompaniaDesc =
      e.target.selectedOptions[0].getAttribute("data-user-role");
    setRoleDesc(selectedCompaniaDesc);
  };

  useEffect(() => {
    setNombre(usuarioSelected && usuarioSelected.Nombre);
    setApellido(usuarioSelected && usuarioSelected.Apellido);
    setCorreo(usuarioSelected && usuarioSelected.Correo);
    setRoleID(usuarioSelected && usuarioSelected.rol_id);
    setRoleDesc(usuarioSelected && usuarioSelected.Rol);
    setUserID(usuarioSelected && usuarioSelected.usuario_id);
  }, [dispatch, usuarioSelected]);

  return (
    <>
      <FaEdit className="iconABM" onClick={handleShow} />

      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Usuario</Modal.Title>
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
                onChange={(e) => setCorreo(e.target.value)}
              />
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
          <Button className="buttonConfirm" onClick={handleEditUsuario}>
            <FaSave className="iconConfirm" />
            Editar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUsuarioFormModal;
