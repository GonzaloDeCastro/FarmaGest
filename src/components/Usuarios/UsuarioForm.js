/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addUsuarioDataAPI } from "../../redux/usuariosSlice";

import { useDispatch } from "react-redux";

const UsuarioFormModal = ({ Roles, ObrasSociales, Companias }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [compania, setCompania] = useState("");

  const [obraSocial, setObraSocial] = useState(0);
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
          rol_id: roleID == 0 ? null : roleID,
          Rol: roleDesc,
          compania: roleID == 2 ? compania : "-",
          obraSocial: obraSocial,
          /*  descripcion: roleDesc, */
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

  const handleChangeCompania = (e) => {
    setCompania(e.target.value);
  };
  console.log("compania ", compania);
  const handleChangeObraSocial = (e) => {
    setObraSocial(e.target.value);
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
                  data-user-role={rol.descripcion}
                >
                  {rol.descripcion.charAt(0).toUpperCase() +
                    rol.descripcion.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {roleID == 2 ? (
            <div className="form-group col-md-12">
              <label htmlFor="roleID">Compania:</label>
              <select
                value={compania}
                className="form-select"
                onChange={handleChangeCompania}
              >
                <option value="" className="default-option">
                  Seleccionar Compania
                </option>
                {Companias?.map((compania) => (
                  <option
                    key={compania.compania_id}
                    value={compania.compania_id}
                    data-compania={compania.compania}
                  >
                    {compania.compania}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            roleID == 1 && (
              <div className="form-group col-md-12">
                <label htmlFor="roleID">Obra Social:</label>
                <select
                  value={obraSocial}
                  className="form-select"
                  onChange={handleChangeObraSocial}
                >
                  <option value="" className="default-option">
                    Seleccionar Obra Social
                  </option>
                  {ObrasSociales?.map((os) => (
                    <option
                      key={os.codigo}
                      value={os.codigo}
                      data-user-os={os.obra_social}
                    >
                      {os.obra_social}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}
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
