import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProductoAPI } from "../../redux/productosSlice";

import { useDispatch } from "react-redux";

const ProductFormModal = ({ Categorias }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [productoNombre, setProductoNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState("");
  const [categoriaID, setCategoria] = useState(0);
  const [categoriaDesc, setCategoriaDesc] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddProduct = () => {
    try {
      dispatch(
        addProductoAPI({
          nombre: productoNombre,
          codigo: codigo,
          marca: marca,
          categoria_id: categoriaID === 0 ? null : categoriaID,
          precio: precio,
          stock: cantidad,
          Categoria: categoriaDesc,
        })
      );
      handleClose();
      setCategoria(0);
      setProductoNombre("");
      setPrecio(0);
      setCantidad(0);
    } catch {}
  };

  const handleChange = (e) => {
    setCategoria(e.target.value);
    const selectedCategoriaDesc = e.target.selectedOptions[0].getAttribute(
      "data-user-categoria"
    );
    setCategoriaDesc(selectedCategoriaDesc);
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
            <div className="form-group col-md-12">
              <label htmlFor="productoNombre">Nombre del producto:</label>
              <input
                type="text"
                producto_id="productoNombre"
                className="form-control"
                value={productoNombre}
                onChange={(e) => setProductoNombre(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="codigo">Codigo:</label>
              <input
                type="text"
                producto_id="codigo"
                className="form-control"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="productoNombre">Marca:</label>
              <input
                type="text"
                producto_id="marca"
                className="form-control"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="precio">Precio:</label>
              <input
                type="number"
                producto_id="precio"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                producto_id="cantidad"
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="categoriaID">Categoria:</label>
              <select
                value={categoriaID}
                className="form-select"
                onChange={handleChange}
              >
                <option value="" className="default-option">
                  Seleccionar Categoria
                </option>
                {Categorias?.map((categoria) => (
                  <option
                    key={categoria.categoria_id}
                    value={categoria.categoria_id}
                    data-user-categoria={categoria.nombre}
                  >
                    {categoria.nombre}
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
