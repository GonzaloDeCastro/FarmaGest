import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { editProductoAPI } from "../../redux/productosSlice";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
const EditProductFormModal = ({ productSelected, Categorias }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [productoNombre, setProductoNombre] = useState(productSelected?.Nombre);
  const [codigo, setCodigo] = useState(productSelected?.Codigo);
  const [marca, setMarca] = useState(productSelected?.Marca);
  const [precio, setPrecio] = useState(productSelected?.Precio);
  const [cantidad, setCantidad] = useState(productSelected?.Stock);
  const [categoriaID, setCategoria] = useState(productSelected?.categoria_id);
  const [categoriaDesc, setCategoriaDesc] = useState(
    productSelected?.Categoria
  );
  console.log("productSelected ", productSelected);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddProduct = () => {
    try {
      dispatch(
        editProductoAPI({
          producto_id: productSelected?.producto_id,
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
      <MdEdit className="iconABM" onClick={handleShow} />

      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="productoNombre">Producto:</label>
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
              <label htmlFor="price">Precio:</label>
              <input
                type="number"
                producto_id="price"
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
              <label htmlFor="categoriaID">Categoría:</label>
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

export default EditProductFormModal;
