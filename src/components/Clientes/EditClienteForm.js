/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { editClienteAPI } from "../../redux/clientesSlice";

const EditClienteForm = ({
  cliente,
  ObrasSociales,
  Ciudades,
  onSave,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [nombre, setNombre] = useState(cliente?.Nombre);
  const [apellido, setApellido] = useState(cliente?.Apellido);
  const [telefono, setTelefono] = useState(cliente?.Telefono);
  const [correo, setCorreo] = useState(cliente?.Correo);
  const [obraSocialID, setObraSocialID] = useState(cliente?.obra_social_id);
  const [ciudadID, setCiudadID] = useState(cliente?.ciudad_id);
  const [clienteID, setClienteID] = useState(cliente?.cliente_id);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log("cliente ", cliente);
  const handleEditCliente = () => {
    try {
      dispatch(
        editClienteAPI({
          cliente_id: parseInt(clienteID),
          Nombre: nombre,
          Apellido: apellido,
          Telefono: telefono,
          Correo: correo,
          obra_social_id: obraSocialID == 0 ? null : obraSocialID,
          ciudad_id: ciudadID == 0 ? null : ciudadID,
        })
      );
      onSave({
        cliente_id: clienteID,
        Nombre: nombre,
        Apellido: apellido,
        Telefono: telefono,
        Correo: correo,
        obra_social_id: obraSocialID,
        ciudad_id: ciudadID,
      });
      handleClose();
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  useEffect(() => {
    setNombre(cliente && cliente.Nombre);
    setApellido(cliente && cliente.Apellido);
    setTelefono(cliente && cliente.Telefono);
    setCorreo(cliente && cliente.Correo);
    setObraSocialID(cliente && cliente.obra_social_id);
    setCiudadID(cliente && cliente.ciudad_id);
    setClienteID(cliente && cliente.cliente_id);
  }, [cliente]);

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
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="text"
                id="telefono"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                id="correo"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="obraSocialID">Obra Social:</label>
              <select
                value={obraSocialID}
                className="form-select"
                onChange={(e) => setObraSocialID(e.target.value)}
              >
                <option value="">Seleccionar obra social</option>
                {ObrasSociales.map((obraSocial) => (
                  <option
                    key={obraSocial.obra_social_id}
                    value={obraSocial.obra_social_id}
                  >
                    {obraSocial.obra_social}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="ciudadID">Ciudad:</label>
              <select
                value={ciudadID}
                className="form-select"
                onChange={(e) => setCiudadID(e.target.value)}
              >
                <option value="">Seleccionar ciudad</option>
                {Ciudades.map((ciudad) => (
                  <option key={ciudad.ciudad_id} value={ciudad.ciudad_id}>
                    {ciudad.ciudad}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonConfirm" onClick={handleEditCliente}>
            <FaSave className="iconConfirm" />
            Guardar Cambios
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditClienteForm;
