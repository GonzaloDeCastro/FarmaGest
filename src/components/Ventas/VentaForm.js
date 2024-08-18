import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
//import { addVentaAPI } from "../../redux/ventasSlice"; // Asegúrate de tener esta acción definida en tu Redux
import { getClientesAPI } from "../../redux/clientesSlice";
const VentaFormModal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    // Aquí podrías formatear los datos si es necesario antes de enviarlos
    // dispatch(addVentaAPI(data));
    handleClose();
  };
  const clientes = useSelector(
    (state) => state && state.cliente && state.cliente
  );

  console.log("clientes ", clientes);
  useEffect(() => {
    dispatch(getClientesAPI());
  }, [dispatch]);

  return (
    <>
      <div onClick={handleShow} className="buttonNewItem">
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        Nueva Factura
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                {...register("clienteNombre", { required: true })}
              />
              {errors.clienteNombre && <span>Este campo es requerido</span>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Detalles de los Productos</Form.Label>
              {/* Aquí podrías tener un componente separado para manejar múltiples productos */}
            </Form.Group>

            <Button type="submit" variant="primary">
              <FaSave /> Guardar Factura
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VentaFormModal;
