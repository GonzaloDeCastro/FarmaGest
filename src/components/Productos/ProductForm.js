import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProductDataAPI } from "../../redux/productosSlice";

import { useDispatch } from "react-redux";

const ProductFormModal = ({ Users }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [companiaID, setCompaniaID] = useState(0);
  const [companiaDesc, setCompaniaDesc] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddProduct = () => {
    try {
      dispatch(
        addProductDataAPI({
          nombre_producto: productName,
          precio: price,
          cantidad: quantity,
          proveedor_id: companiaID === 0 ? null : companiaID,
          Compania: companiaDesc,
        })
      );
      handleClose();
      setCompaniaID(0);
      setProductName("");
      setPrice(0);
      setQuantity(0);
    } catch {}
  };

  const handleChange = (e) => {
    setCompaniaID(e.target.value);
    const selectedCompaniaDesc =
      e.target.selectedOptions[0].getAttribute("data-user-compania");
    setCompaniaDesc(selectedCompaniaDesc);
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Nuevo Producto</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="productName">Nombre del producto:</label>
              <input
                type="text"
                producto_id="productName"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="price">Precio:</label>
              <input
                type="number"
                producto_id="price"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="quantity">Cantidad:</label>
              <input
                type="number"
                producto_id="quantity"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="companiaID">Compania:</label>
              <select
                value={companiaID}
                className="form-select"
                onChange={handleChange}
              >
                <option value="" className="default-option">
                  Seleccion proveedor
                </option>
                {Users?.map((user) => (
                  <option
                    key={user.usuario_id}
                    value={user.usuario_id}
                    data-user-compania={user.Compania}
                  >
                    {user.Compania}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonConfirm" onClick={handleAddProduct}>
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

export default ProductFormModal;
