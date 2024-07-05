import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addObraSocialAPI } from "../../redux/obrasSocialesSlice";
import { useDispatch } from "react-redux";

const ObraSocialForm = () => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [obraSocial, setObraSocial] = useState("");
  const [plan, setPlan] = useState("");
  const [descuento, setDescuento] = useState("");
  const [codigo, setCodigo] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddObraSocial = () => {
    try {
      dispatch(
        addObraSocialAPI({
          obra_social: obraSocial,
          plan: plan,
          descuento: descuento,
          codigo: codigo,
        })
      );
      handleClose();
      setObraSocial("");
      setPlan("");
      setDescuento("");
      setCodigo("");
    } catch (error) {
      console.error("Error al agregar la obra social:", error);
    }
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Nueva Obra Social</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nueva Obra Social</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="obraSocial">Obra Social:</label>
              <input
                type="text"
                id="obraSocial"
                className="form-control"
                value={obraSocial}
                onChange={(e) => setObraSocial(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="plan">Plan:</label>
              <input
                type="text"
                id="plan"
                className="form-control"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="descuento">Descuento:</label>
              <input
                type="text"
                id="descuento"
                className="form-control"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="codigo">Código:</label>
              <input
                type="text"
                id="codigo"
                className="form-control"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonConfirm" onClick={handleAddObraSocial}>
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

export default ObraSocialForm;
