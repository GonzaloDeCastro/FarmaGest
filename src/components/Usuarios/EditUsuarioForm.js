import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import {
  editarUsuarioDataAPI,
  getRolesDataAPI,
  getObrasSocialesDataAPI,
} from "../../redux/usuariosSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
const EditUsuarioFormModal = ({ usuarioSelected, Users }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  console.log("usuarioSelected ", usuarioSelected);
  const Roles = useSelector((state) => state && state?.usuario?.rolesState);
  const ObrasSociales = useSelector(
    (state) => state && state?.usuario?.obrasSocialesState
  );

  const [nombre, setNombre] = useState(usuarioSelected?.Nombre);
  const [apellido, setApellido] = useState(usuarioSelected?.Apellido);
  const [correo, setCorreo] = useState(usuarioSelected?.Email);
  const [roleID, setRoleID] = useState(usuarioSelected?.role_id);
  const [compania, setCompania] = useState(usuarioSelected?.Compania);
  const [roleDesc, setRoleDesc] = useState(usuarioSelected?.Rol);
  const [obraSocial, setObraSocial] = useState(usuarioSelected?.codigo);
  const [cuit, setCuit] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddUsuario = () => {
    try {
      dispatch(
        editarUsuarioDataAPI({
          usuario_id: usuarioSelected && parseInt(usuarioSelected.usuario_id),
          nombre: nombre,
          apellido: apellido,
          correo_electronico: correo,
          rol_id: roleID === 0 ? null : roleID,
          Rol: roleDesc,
          compania: roleID == 2 ? compania : "-",
          cuit: roleID == 2 && cuit.toString(),
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
  const handleCuitChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,11}$/.test(value)) {
      setCuit(value);
    }
  };
  useEffect(() => {
    dispatch(getRolesDataAPI());
    dispatch(getObrasSocialesDataAPI());
    setNombre(usuarioSelected && usuarioSelected.Nombre);
    setApellido(usuarioSelected && usuarioSelected.Apellido);
    setCorreo(usuarioSelected && usuarioSelected.Email);
    setRoleID(usuarioSelected && usuarioSelected.rol_id);
    setCompania(usuarioSelected && usuarioSelected.Compania);
    setCuit(usuarioSelected && usuarioSelected.cuit);
    setRoleDesc(usuarioSelected && usuarioSelected.Rol);
    setObraSocial(usuarioSelected && usuarioSelected.codigo);
  }, [dispatch]);

  const handleChangeObraSocial = (e) => {
    setObraSocial(e.target.value);
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
            <>
              <div className="form-group col-md-12">
                <label htmlFor="compania">Compania:</label>
                <input
                  type="text"
                  usuario_id="compania"
                  className="form-control"
                  value={compania}
                  onChange={(e) => setCompania(e.target.value)}
                />
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="cuit">C.U.I.T.:</label>
                <input
                  type="number"
                  usuario_id="cuit"
                  className="form-control"
                  value={cuit}
                  max={99999999999}
                  onChange={handleCuitChange}
                  /* onChange={(e) => setCuit(parseInt(e.target.value))} */
                />
              </div>
            </>
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
