import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
//import { addVentaAPI } from "../../redux/ventasSlice"; // Asegúrate de tener esta acción definida en tu Redux
import { getProductosAPI } from "../../redux/productosSlice";
import Select from "react-select";

const AgregarItems = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [producto, setProducto] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const handleClose = () => {
    setShow(false);
    setProducto(0);
    setPrecio(0);
    setCantidad(0);
    reset();
  };

  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    // Aquí podrías formatear los datos si es necesario antes de enviarlos
    // dispatch(addVentaAPI(data));
    handleClose();
  };

  const productos = useSelector((state) => state && state?.producto);

  useEffect(() => {
    dispatch(getProductosAPI());
  }, [dispatch]);

  let optionsProductos =
    productos &&
    productos?.initialState?.map((producto) => ({
      value: producto.producto_id,
      label: `${producto.Codigo} - ${producto.Nombre}`,
    }));

  const handleProducto = (event) => {
    setProducto(event.target.value);

    /*  const selectedEventReasonDesc =
      event.target.selectedOptions[0].getAttribute("data-event-reason-desc");
    setEventReasonDesc(selectedEventReasonDesc); */
  };

  useEffect(() => {
    if (producto) {
      const selectedProduct =
        productos &&
        productos?.initialState &&
        productos?.initialState?.find(
          (product) => product.producto_id === producto
        ).Precio;
      if (cantidad < 2 || isNaN(cantidad)) {
        setPrecio(parseInt(selectedProduct * 1));
      } else {
        setPrecio(parseInt(selectedProduct * cantidad));
      }
    }
  }, [producto, cantidad, productos]);

  return (
    <>
      <Button onClick={handleShow} className="mb-2">
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        Agregar Productos
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <div
                className="form-group col-md-6"
                style={{ width: "100%", fontSize: "15px" }}
              >
                <label style={{ display: "block" }} htmlFor="code">
                  Producto:
                </label>

                {show && (
                  <Select
                    value={
                      (optionsProductos &&
                        optionsProductos?.find(
                          (option) => option.value === producto
                        )) ||
                      null
                    }
                    onChange={(option) =>
                      handleProducto({
                        target: { value: option ? option.value : 0 },
                      })
                    }
                    options={optionsProductos}
                    placeholder="Selection Event Reason"
                    classNamePrefix="react-select"
                  />
                )}
              </div>
              <div style={{ display: "flex" }}>
                <div className="form-group col-md-6">
                  <label style={{ display: "block" }} htmlFor="code">
                    Cantidad:
                  </label>
                  <input
                    maxLength="50"
                    type="number"
                    id="cantidad"
                    className="form-control"
                    value={cantidad}
                    onChange={(e) =>
                      setCantidad(
                        parseInt(
                          e.target.value < 0
                            ? e.target.value * -1
                            : e.target.value
                        )
                      )
                    }
                  />
                </div>
                <div
                  className="form-group col-md-6"
                  style={{ marginLeft: "10%" }}
                >
                  <label style={{ display: "block" }} htmlFor="code">
                    Precio:
                  </label>
                  {`$${precio}`}
                </div>
              </div>
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

export default AgregarItems;
