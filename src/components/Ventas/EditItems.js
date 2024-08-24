import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { addItemAPI } from "../../redux/itemsSlice";
import { getProductosAPI } from "../../redux/productosSlice";
import Select from "react-select";

const EditarItem = ({ onAgregarItem }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      producto: null,
      cantidad: 1,
      precio: 0,
      total: 0,
    },
  });
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const productos = useSelector((state) => state.producto?.initialState || []);

  useEffect(() => {
    dispatch(getProductosAPI());
  }, [dispatch]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "producto" || name === "cantidad") {
        updateTotal(value.cantidad, value.precio);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    console.log("data ", data);
    dispatch(
      addItemAPI({
        producto: data.producto,
        cantidad: data.cantidad,
        precio: data.precio,
        total: data.total,
      })
    );
    onAgregarItem(data); // Llama a la función de callback para actualizar el estado en VentaFormModal
    handleClose();
  };

  const updateTotal = (cantidad, precio) => {
    setValue("total", cantidad * precio);
  };

  const handleProductoChange = (producto) => {
    const selectedProducto = productos.find((p) => p.producto_id === producto);
    if (selectedProducto) {
      setValue("precio", selectedProducto.Precio);
      updateTotal(watch("cantidad"), selectedProducto.Precio);
    }
  };

  const optionsProductos = productos.map((producto) => ({
    value: producto.producto_id,
    label: `${producto.Codigo} - ${producto.Nombre}`,
  }));

  return (
    <>
      <FaEdit className="iconABM" onClick={handleShow} />

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <label>Producto:</label>
              <Controller
                name="producto"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={optionsProductos}
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
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Cantidad:</label>
              <input
                type="number"
                {...control.register("cantidad", { valueAsNumber: true })}
                className="form-control"
                onChange={(e) => setValue("cantidad", parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Precio Unitario:</label>
              <p>{`$${watch("precio")}`}</p>
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Total:</label>
              <p>{`$${watch("total")}`}</p>
            </Form.Group>

            <Button type="submit" variant="primary">
              Agregar Item
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditarItem;
