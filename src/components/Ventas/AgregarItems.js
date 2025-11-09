import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";

import { getProductosAPI, selectProductos } from "../../redux/productosSlice";
import Select from "react-select";

const AgregarItems = ({ onAgregarItem }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productoId: null,
      cantidad: 1,
      precio: 0,
      total: 0,
    },
  });
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const productos = useSelector(selectProductos);

  useEffect(() => {
    dispatch(getProductosAPI());
  }, [dispatch]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "productoId" || name === "cantidad") {
        updateTotal(value.cantidad, value.precio);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleClose = () => {
    setOutOfStock(false);
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    const productoSeleccionado = productos.find(
      (p) => p.producto_id === data.productoId
    );

    if (!productoSeleccionado) {
      return;
    }

    const precioProducto =
      parseFloat(
        productoSeleccionado.Precio ?? productoSeleccionado.precio ?? 0
      ) || 0;

    const productoNombre =
      productoSeleccionado.Nombre ?? productoSeleccionado.nombre ?? "";

    const dataComplete = {
      ...data,
      precio: precioProducto,
      total: (data.cantidad || 0) * precioProducto,
      nombre: productoNombre,
    };

    onAgregarItem(dataComplete);
    handleClose();
  };

  const updateTotal = (cantidad, precio) => {
    const cantidadNumber = parseFloat(cantidad) || 0;
    const precioNumber = parseFloat(precio) || 0;

    if (isNaN(cantidadNumber) || isNaN(precioNumber)) {
      setValue("total", 0);
    } else {
      setValue("total", cantidadNumber * precioNumber);
    }
  };

  const handleProductoChange = (productoId) => {
    const selectedProducto = productos.find(
      (p) => p.producto_id === productoId
    );
    const stock =
      selectedProducto?.Stock ?? selectedProducto?.stock ?? null;
    if (selectedProducto) {
      const precioSeleccionado =
        parseFloat(
          selectedProducto.Precio ?? selectedProducto.precio ?? 0
        ) || 0;
      setValue("precio", precioSeleccionado);
      updateTotal(watch("cantidad"), precioSeleccionado);
    }
    setOutOfStock(stock);
  };

  const optionsProductos = productos.map((producto) => {
    const codigo = producto.Codigo ?? producto.codigo ?? "";
    const nombre = producto.Nombre ?? producto.nombre ?? "";
    return {
      value: producto.producto_id,
      label: codigo ? `${codigo} - ${nombre}` : nombre,
    };
  });

  return (
    <>
      <div
        onClick={handleShow}
        className="buttonConfirm"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px",
          borderRadius: "0px 10px 10px 0px",
          cursor: "pointer",
        }}
      >
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div style={{ whiteSpace: "nowrap" }}>Agregar Items</div>
      </div>
      {show && <div className="modal-overlay"></div>}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <label>Producto:</label>
              <Controller
                name="productoId"
                id="cantidad"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={optionsProductos}
                    {...register("productoId", {
                      required: "Debe elegir al menos 1 producto",
                    })}
                    onChange={(val) => {
                      field.onChange(val ? val.value : null);
                      handleProductoChange(val ? val.value : null);
                    }}
                    value={optionsProductos.find(
                      (option) => option.value === field.value
                    )}
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.productoId && (
                <p className="text-danger">{errors.productoId.message}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Cantidad:</label>
              <input
                type="number"
                id="cantidad"
                className="form-control"
                {...register("cantidad", {
                  required: "Debe elegir al menos 1 unidad",
                })}
                onChange={(e) =>
                  setValue("cantidad", parseInt(e.target.value, 10) || 0)
                }
              />
              {errors.cantidad && (
                <p className="text-danger">{errors.cantidad.message}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Precio Unitario:</label>
              <p>{`$${Number(watch("precio") || 0).toFixed(2)}`}</p>
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Total:</label>
              <p>{`$${Number(watch("total") || 0).toFixed(2)}`}</p>
            </Form.Group>
            {outOfStock && outOfStock < 1 ? (
              <p className="text-danger">
                El producto seleccionado no tiene stock
              </p>
            ) : (
              outOfStock &&
              outOfStock && <p>Cantidad disponible: {outOfStock}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={Object.keys(errors).length > 0}
            >
              Agregar Item
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AgregarItems;
