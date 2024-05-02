import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { editarProductDataAPI } from "../../redux/productsSlice";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
const EditProductFormModal = ({ productSelected }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [productName, setProductName] = useState(productSelected?.Producto);
  const [price, setPrice] = useState(productSelected?.Precio);
  const [quantity, setQuantity] = useState(productSelected?.Cantidad);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddProduct = () => {
    try {
      dispatch(
        editarProductDataAPI({
          id: productSelected?.id,
          nombre_producto: productName,
          precio: price,
          cantidad: quantity,
        })
      );
      handleClose();
    } catch {}
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
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="productName">Product Name:</label>
              <input
                type="text"
                id="productName"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
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

export default EditProductFormModal;
