import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProveedorAPI } from "../../redux/proveedoresSlice";
import { useDispatch } from "react-redux";

const ProveedorForm = () => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [razonSocial, setRazonSocial] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddProveedor = () => {
    try {
      dispatch(
        addProveedorAPI({
          razon_social: razonSocial,
          telefono: telefono,
          direccion: direccion,
        })
      );
      handleClose();
      setRazonSocial("");
      setTelefono("");
      setDireccion("");
    } catch (error) {
      console.error("Error al agregar el proveedor:", error);
    }
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Nuevo Proveedor</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="razonSocial">Razón Social:</label>
              <input
                type="text"
                id="razonSocial"
                className="form-control"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
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
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonConfirm" onClick={handleAddProveedor}>
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

export default ProveedorForm;
