import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
//import { addVentaAPI } from "../../redux/ventasSlice"; // Asegúrate de tener esta acción definida en tu Redux
import { getClientesAPI } from "../../redux/clientesSlice";
import Select from "react-select";
import AgregarItems from "./AgregarItems";

const VentaFormModal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [cliente, setCliente] = useState(0);
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

  useEffect(() => {
    dispatch(getClientesAPI());
  }, [dispatch]);

  let optionsClientes =
    clientes &&
    clientes?.initialState?.map((cliente) => ({
      value: cliente.cliente_id,
      label: `${cliente.DNI} - ${cliente.Apellido} ${cliente.Nombre}`,
    }));

  const handleCliente = (event) => {
    setCliente(event.target.value);

    /*  const selectedEventReasonDesc =
      event.target.selectedOptions[0].getAttribute("data-event-reason-desc");
    setEventReasonDesc(selectedEventReasonDesc); */
  };

  return (
    <>
      <div onClick={handleShow} className="buttonNewItem">
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        Nueva Factura
      </div>

      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <div
                className="form-group col-md-6"
                style={{ width: "30%", fontSize: "15px" }}
              >
                <label style={{ display: "block" }} htmlFor="code">
                  Cliente:
                </label>

                {show && (
                  <Select
                    value={
                      (optionsClientes &&
                        optionsClientes?.find(
                          (option) => option.value === cliente
                        )) ||
                      null
                    }
                    onChange={(option) =>
                      handleCliente({
                        target: { value: option ? option.value : 0 },
                      })
                    }
                    options={optionsClientes}
                    placeholder="Selection Event Reason"
                    classNamePrefix="react-select"
                  />
                )}
              </div>
            </Form.Group>

            <Form.Group
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Form.Label>Detalles de los Productos</Form.Label>
              <AgregarItems />
              {/* Aquí podrías tener un componente separado para manejar múltiples productos */}
            </Form.Group>

            <Button type="submit" className="buttonConfirm">
              Crear Factura
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VentaFormModal;
