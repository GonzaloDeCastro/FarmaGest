import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave, FaEdit } from "react-icons/fa";
import { editObraSocialAPI } from "../../redux/obrasSocialesSlice";
import { useDispatch } from "react-redux";

const EditObraSocialForm = ({ obraSocialSelected }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [obraSocial, setObraSocial] = useState(obraSocialSelected?.obra_social);
  const [plan, setPlan] = useState(obraSocialSelected?.Plan);
  const [descuento, setDescuento] = useState(obraSocialSelected?.Descuento);
  const [codigo, setCodigo] = useState(obraSocialSelected?.Codigo);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditObraSocial = () => {
    try {
      dispatch(
        editObraSocialAPI({
          obra_social_id:
            obraSocialSelected && obraSocialSelected?.obra_social_id,
          obra_social: obraSocial,
          plan: plan,
          descuento: descuento,
          codigo: codigo,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error al editar la obra social:", error);
    }
  };
  useEffect(() => {
    setObraSocial(obraSocialSelected?.obra_social);
    setPlan(obraSocialSelected?.Plan);
    setDescuento(obraSocialSelected?.Descuento);
    setCodigo(obraSocialSelected?.Codigo);
  }, [show]);

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
          <Modal.Title>Editar Obra Social</Modal.Title>
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
          <Button className="buttonConfirm" onClick={handleEditObraSocial}>
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

export default EditObraSocialForm;
