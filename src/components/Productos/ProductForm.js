import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProductoAPI } from "../../redux/productosSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import ProductoBuilder from "../../patterns/builders/ProductoBuilder";
import ProductoAdapter from "../../patterns/adapters/ProductoAdapter";
import Swal from "sweetalert2";

const ProductFormModal = ({ Categorias, usuarioId }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoriaID: "", // Valor por defecto vacío
      categoriaDesc: "", // Valor por defecto vacío
    },
  });

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const handleAddProduct = (data) => {
    try {
      // Usar Builder Pattern para construir el objeto de producto
      const productoData = new ProductoBuilder()
        .setNombre(data.productoNombre)
        .setCodigo(data.codigo)
        .setMarca(data.marca)
        .setCategoria(data.categoriaID, data.categoriaDesc)
        .setPrecio(data.precio)
        .setStock(data.cantidad)
        .setUsuario(usuarioId)
        .build();

      // Usar Adapter Pattern para transformar a formato del backend
      const backendData = ProductoAdapter.toBackendFormat(data, usuarioId);
      
      dispatch(addProductoAPI(backendData));
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: error.message,
      });
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
                  type="text"
                  id="precio"
                  className="form-control"
                  {...register("precio", {
                    required: "Este campo es requerido",
                    pattern: {
                      value: /^\d+(?:[\.,]\d{0,2})?$/,
                      message: "Ingrese un número válido (ej: 1234.56)",
                    },
                  })}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, ".");
                    setValue("precio", value);
                  }}
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
                <label htmlFor="categoriaID">Categoria (Opcional):</label>
                <select
                  id="categoriaID"
                  className="form-select"
                  {...register("categoriaID")}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" className="default-option">
                    {Categorias && Array.isArray(Categorias) && Categorias.length > 0 
                      ? "Seleccionar Categoria (Opcional)" 
                      : "Sin categorías disponibles (Opcional)"}
                  </option>
                  {Categorias && Array.isArray(Categorias) && Categorias.length > 0 && (
                    Categorias.map((categoria) => (
                      <option
                        key={categoria.categoria_id || categoria.id}
                        value={categoria.categoria_id || categoria.id}
                        data-user-categoria={categoria.nombre || categoria.Nombre || categoria.name}
                      >
                        {categoria.nombre || categoria.Nombre || categoria.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.categoriaID && errors.categoriaID.message && (
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
