/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { editarUsuarioDataAPI } from "../../redux/usuariosSlice";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
const EditUsuarioFormModal = ({
  usuarioSelected,
  Roles,
  ObrasSociales,
  Companias,
}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [nombre, setNombre] = useState(usuarioSelected?.Nombre);
  const [apellido, setApellido] = useState(usuarioSelected?.Apellido);
  const [correo, setCorreo] = useState(usuarioSelected?.Email);
  const [roleID, setRoleID] = useState(usuarioSelected?.role_id);
  const [compania, setCompania] = useState(usuarioSelected?.compania_id);
  const [roleDesc, setRoleDesc] = useState(usuarioSelected?.Rol);
  const [obraSocial, setObraSocial] = useState(usuarioSelected?.codigo);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditUsuario = () => {
    try {
      dispatch(
        editarUsuarioDataAPI({
          usuario_id: usuarioSelected && parseInt(usuarioSelected.usuario_id),
          nombre: nombre,
          apellido: apellido,
          correo_electronico: correo,
          rol_id: roleID == 0 ? null : roleID,
          Rol: roleDesc,
          compania_id: roleID == 2 ? compania : "-",
          obraSocial: obraSocial,
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
    setCorreo(usuarioSelected && usuarioSelected.Email);
    setRoleID(usuarioSelected && usuarioSelected.rol_id);
    setCompania(usuarioSelected && usuarioSelected.compania_id);
    setRoleDesc(usuarioSelected && usuarioSelected.Rol);
    setObraSocial(usuarioSelected && usuarioSelected.codigo);
  }, [dispatch, usuarioSelected]);

  const handleChangeObraSocial = (e) => {
    setObraSocial(e.target.value);
  };
  const handleChangeCompania = (e) => {
    setCompania(e.target.value);
  };

  return (
    <>
      <MdEdit className="iconABM" onClick={handleShow} />

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
              disabled
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
