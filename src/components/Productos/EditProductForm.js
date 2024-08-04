import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave, FaEdit } from "react-icons/fa";
import { editProductoAPI } from "../../redux/productosSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const EditProductFormModal = ({ productSelected, Categorias }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productoNombre: productSelected?.Nombre || "",
      codigo: productSelected?.Codigo || "",
      marca: productSelected?.Marca || "",
      precio: productSelected?.Precio || "",
      cantidad: productSelected?.Stock || "",
      categoriaID: productSelected?.categoria_id || "",
    },
  });

  const watchCategoriaID = watch("categoriaID");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    try {
      dispatch(
        editProductoAPI({
          producto_id: productSelected?.producto_id,
          nombre: data.productoNombre,
          codigo: data.codigo,
          marca: data.marca,
          categoria_id: data.categoriaID === "" ? null : data.categoriaID,
          precio: data.precio,
          stock: data.cantidad,
          Categoria:
            Categorias.find((c) => c.categoria_id === Number(data.categoriaID))
              ?.nombre || "",
        })
      );
      handleClose();
    } catch {}
  };

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
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="productoNombre">Producto:</label>
                <input
                  type="text"
                  id="productoNombre"
                  className="form-control"
                  {...register("productoNombre", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.productoNombre && (
                  <p className="text-danger">{errors.productoNombre.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="codigo">Codigo:</label>
                <input
                  type="text"
                  id="codigo"
                  className="form-control"
                  {...register("codigo", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.codigo && (
                  <p className="text-danger">{errors.codigo.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  id="marca"
                  className="form-control"
                  {...register("marca", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.marca && (
                  <p className="text-danger">{errors.marca.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="precio">Precio:</label>
                <input
                  type="number"
                  id="precio"
                  className="form-control"
                  {...register("precio", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.precio && (
                  <p className="text-danger">{errors.precio.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  {...register("cantidad", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.cantidad && (
                  <p className="text-danger">{errors.cantidad.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="categoriaID">Categoría:</label>
                <select
                  id="categoriaID"
                  className="form-select"
                  {...register("categoriaID", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccionar Categoria</option>
                  {Categorias?.map((categoria) => (
                    <option
                      key={categoria.categoria_id}
                      value={categoria.categoria_id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoriaID && (
                  <p className="text-danger">{errors.categoriaID.message}</p>
                )}
              </div>
            </div>
            <Modal.Footer>
              <Button className="buttonConfirm" type="submit">
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

export default EditProductFormModal;
