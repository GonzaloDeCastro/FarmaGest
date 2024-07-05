/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { editClienteAPI } from "../../redux/clientesSlice";

const EditClienteForm = ({ clienteSelected, ObrasSociales, Ciudades }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [nombre, setNombre] = useState(clienteSelected?.Nombre);
  const [apellido, setApellido] = useState(clienteSelected?.Apellido);
  const [DNI, setDNI] = useState(clienteSelected?.DNI);
  /*  const [correo, setCorreo] = useState(clienteSelected?.Correo); */
  const [obraSocialID, setObraSocialID] = useState(
    clienteSelected?.obra_social_id
  );
  const [obraSocialDesc, setObraSocialDesc] = useState(
    clienteSelected?.obra_social
  );
  const [ciudadID, setCiudadID] = useState(clienteSelected?.ciudad_id);
  const [ciudadDesc, setCiudadDesc] = useState(clienteSelected?.Ciudad);
  const [clienteID, setClienteID] = useState(clienteSelected?.cliente_id);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log("clienteSelected ", clienteSelected);
  const handleEditCliente = () => {
    try {
      dispatch(
        editClienteAPI({
          cliente_id: parseInt(clienteID),
          nombre: nombre,
          apellido: apellido,
          dni: DNI,
          // Correo: correo,
          obra_social_id: obraSocialID == 0 ? null : obraSocialID,
          obra_social: obraSocialDesc,
          ciudad_id: ciudadID == 0 ? null : ciudadID,
          Ciudad: ciudadDesc,
        })
      );

      handleClose();
    } catch (error) {
      console.error("Error al editar clienteSelected:", error);
    }
  };

  useEffect(() => {
    setNombre(clienteSelected && clienteSelected.Nombre);
    setApellido(clienteSelected && clienteSelected.Apellido);
    setDNI(clienteSelected && clienteSelected.DNI);
    // setCorreo(clienteSelected && clienteSelected.Correo);
    setObraSocialID(clienteSelected && clienteSelected.obra_social_id);
    setCiudadID(clienteSelected && clienteSelected.ciudad_id);
    setClienteID(clienteSelected && clienteSelected.cliente_id);
  }, [clienteSelected]);

  const handleChangeObraSocial = (e) => {
    setObraSocialID(e.target.value);
    const selectedObraSocialDesc =
      e.target.selectedOptions[0].getAttribute("data-obra-social");
    setObraSocialDesc(selectedObraSocialDesc);
  };
  const handleChangeCiudad = (e) => {
    setCiudadID(e.target.value);
    const selectedCiudadDesc = e.target.selectedOptions[0].getAttribute(
      "data-cliente-ciudad"
    );
    setCiudadDesc(selectedCiudadDesc);
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
              <label htmlFor="DNI">DNI:</label>
              <input
                type="text"
                id="DNI"
                className="form-control"
                value={DNI}
                onChange={(e) => setDNI(e.target.value)}
              />
            </div>
            {/* <div className="form-group col-md-12">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                id="correo"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div> */}
            <div className="form-group col-md-12">
              <label htmlFor="obraSocialID">Obra Social:</label>
              <select
                value={obraSocialID}
                className="form-select"
                onChange={handleChangeObraSocial}
              >
                <option value="">Seleccionar obra social</option>
                {ObrasSociales &&
                  ObrasSociales?.map((obraSocial) => (
                    <option
                      key={obraSocial.obra_social_id}
                      value={obraSocial.obra_social_id}
                      data-obra-social={obraSocial.obra_social}
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
                onChange={handleChangeCiudad}
              >
                <option value="">Seleccionar ciudad</option>
                {Ciudades &&
                  Ciudades?.map((ciudad) => (
                    <option
                      key={ciudad.ciudad_id}
                      value={ciudad.ciudad_id}
                      data-cliente-ciudad={ciudad.ciudad}
                    >
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
