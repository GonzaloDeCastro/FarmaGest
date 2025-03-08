import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProductoAPI } from "../../redux/productosSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const ProductFormModal = ({ Categorias, usuarioId }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const handleAddProduct = (data) => {
    try {
      dispatch(
        addProductoAPI({
          nombre: data.productoNombre,
          codigo: data.codigo,
          marca: data.marca,
          categoria_id: data.categoriaID === 0 ? null : data.categoriaID,
          precio: data.precio,
          stock: data.cantidad,
          Categoria: data.categoriaDesc,
          usuario_id: usuarioId,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const handleChange = (e) => {
    const selectedCategoriaDesc = e.target.selectedOptions[0].getAttribute(
      "data-user-categoria"
    );
    setValue("categoriaDesc", selectedCategoriaDesc);
    setValue("categoriaID", e.target.value);
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
          <form onSubmit={handleSubmit(handleAddProduct)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="productoNombre">Nombre del producto:</label>
                <input
                  type="text"
                  id="productoNombre"
                  className="form-control"
                  {...register("productoNombre", {
                    required: "Este campo es requerido",
                  })}
                  autoFocus
                />
                {errors.productoNombre && (
                  <p style={{ color: "red" }}>
                    {errors.productoNombre.message}
                  </p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="codigo">Codigo:</label>
                <input
                  type="text"
                  id="codigo"
                  className="form-control"
                  {...register("codigo", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.codigo && (
                  <p style={{ color: "red" }}>{errors.codigo.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  id="marca"
                  className="form-control"
                  {...register("marca", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.marca && (
                  <p style={{ color: "red" }}>{errors.marca.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="precio">Precio:</label>
                <input
                  type="number"
                  id="precio"
                  className="form-control"
                  {...register("precio", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.precio && (
                  <p style={{ color: "red" }}>{errors.precio.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  {...register("cantidad", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.cantidad && (
                  <p style={{ color: "red" }}>{errors.cantidad.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="categoriaID">Categoria:</label>
                <select
                  id="categoriaID"
                  className="form-select"
                  {...register("categoriaID", {
                    required: "Este campo es requerido",
                  })}
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
                {errors.categoriaID && (
                  <p style={{ color: "red" }}>{errors.categoriaID.message}</p>
                )}
              </div>
            </div>
            <input type="hidden" {...register("categoriaDesc")} />
            <Modal.Footer>
              <Button type="submit" className="buttonConfirm">
                <FaSave className="iconConfirm" />
                Confirmar
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductFormModal;
