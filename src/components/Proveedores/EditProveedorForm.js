import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { editProveedorAPI } from "../../redux/proveedoresSlice";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";

const EditProveedorForm = ({ proveedorSelected }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [razonSocial, setRazonSocial] = useState(
    proveedorSelected?.razon_social
  );
  const [telefono, setTelefono] = useState(proveedorSelected?.telefono);
  const [direccion, setDireccion] = useState(proveedorSelected?.direccion);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditProveedor = () => {
    try {
      dispatch(
        editProveedorAPI({
          id: proveedorSelected?.id,
          razon_social: razonSocial,
          telefono: telefono,
          direccion: direccion,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error al editar el proveedor:", error);
    }
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
          <Modal.Title>Editar Proveedor</Modal.Title>
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
          <Button className="buttonConfirm" onClick={handleEditProveedor}>
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

export default EditProveedorForm;
