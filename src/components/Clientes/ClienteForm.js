/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addClienteAPI } from "../../redux/clientesSlice";
import { useDispatch } from "react-redux";

const ClienteFormModal = ({ Ciudades, ObrasSociales }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  //const [correo, setCorreo] = useState("");
  const [DNI, setDNI] = useState("");
  const [obraSocialID, setObraSocialID] = useState(0);
  const [obraSocialDesc, setObraSocialDesc] = useState("");
  const [ciudadID, setCiudadID] = useState(0);
  const [ciudadDesc, setCiudadDesc] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddCliente = () => {
    try {
      dispatch(
        addClienteAPI({
          nombre: nombre,
          apellido: apellido,
          dni: DNI,
          // Correo: correo,
          obra_social_id: obraSocialID == 0 ? null : parseInt(obraSocialID),
          obra_social: obraSocialDesc,
          ciudad_id: ciudadID == 0 ? null : parseInt(ciudadID),
          Ciudad: ciudadDesc,
        })
      );
      handleClose();
      // Limpiar campos después de agregar cliente
      setNombre("");
      setApellido("");
      //setCorreo("");
      setDNI("");
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };
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
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Agregar Cliente</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Cliente</Modal.Title>
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
            {/*  <div className="form-group col-md-12">
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
              <label htmlFor="DNI">DNI:</label>
              <input
                type="text"
                id="DNI"
                className="form-control"
                value={DNI}
                onChange={(e) => setDNI(e.target.value)}
              />
            </div>
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
          <Button className="buttonConfirm" onClick={handleAddCliente}>
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

export default ClienteFormModal;
