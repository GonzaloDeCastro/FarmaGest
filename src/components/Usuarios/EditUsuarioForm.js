import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { editarUsuarioDataAPI } from "../../redux/usuariosSlice";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
const EditUsuarioFormModal = ({ usuarioSelected, Users }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [usuarioName, setUsuarioName] = useState(usuarioSelected?.Usuario);
  const [price, setPrice] = useState(usuarioSelected?.Precio);
  const [quantity, setQuantity] = useState(usuarioSelected?.Cantidad);
  const [compania, setCompania] = useState(usuarioSelected?.UsuarioID);
  /*   console.log("usuarioSelected", usuarioSelected);
  console.log("Users ", Users); */

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddUsuario = () => {
    try {
      dispatch(
        editarUsuarioDataAPI({
          usuario_id: usuarioSelected?.usuario_id,
          nombre_usuario: usuarioName,
          precio: price,
          cantidad: quantity,
          proveedor_id: compania,
        })
      );
      handleClose();
    } catch {}
  };
  const handleChange = (e) => {
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
            <div className="form-group col-md-6">
              <label htmlFor="usuarioName">Usuario Name:</label>
              <input
                type="text"
                usuario_id="usuarioName"
                className="form-control"
                value={usuarioName}
                onChange={(e) => setUsuarioName(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                usuario_id="price"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                usuario_id="quantity"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
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

export default EditUsuarioFormModal;
