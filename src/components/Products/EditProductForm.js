import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { editarProductDataAPI } from "../../redux/productsSlice";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
const EditProductFormModal = ({ productSelected, Users }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [productName, setProductName] = useState(productSelected?.Producto);
  const [price, setPrice] = useState(productSelected?.Precio);
  const [quantity, setQuantity] = useState(productSelected?.Cantidad);
  const [compania, setCompania] = useState(productSelected?.UsuarioID);
  console.log("productSelected", productSelected);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddProduct = () => {
    try {
      dispatch(
        editarProductDataAPI({
          producto_id: productSelected?.producto_id,
          nombre_producto: productName,
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
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="productName">Product Name:</label>
              <input
                type="text"
                producto_id="productName"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                producto_id="price"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                producto_id="quantity"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="compania">Compania:</label>
              <select
                value={compania}
                className="form-select"
                onChange={handleChange}
              >
                <option value="" className="default-option">
                  Section area
                </option>
                {Users?.map((user) => (
                  <option key={user.usuario_id} value={user.usuario_id}>
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

export default EditProductFormModal;
