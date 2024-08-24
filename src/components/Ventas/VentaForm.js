import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
//import { addVentaAPI } from "../../redux/ventasSlice"; // Asegúrate de tener esta acción definida en tu Redux
import { getClientesAPI } from "../../redux/clientesSlice";
import { getItemsAPI } from "../../redux/itemsSlice";
import Select from "react-select";
import AgregarItems from "./AgregarItems";
import { FaRegTrashAlt } from "react-icons/fa";
import EditarItem from "./EditItems";
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
  const [itemsAgregados, setItemsAgregados] = useState([]);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    // Aquí podrías formatear los datos si es necesario antes de enviarlos
    // dispatch(addVentaAPI(data));
    // handleClose();
  };
  const clientes = useSelector(
    (state) => state && state.cliente && state.cliente
  );
  const items = useSelector((state) => state && state?.item?.initialState);
  useEffect(() => {
    dispatch(getClientesAPI());
    dispatch(getItemsAPI());
  }, [dispatch, items, show]);

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

  // En VentaFormModal
  const handleAgregarItem = (item) => {
    setItemsAgregados((prevItems) => [...prevItems, item]);
  };
  console.log("items ", items);
  console.log("itemsAgregados ", itemsAgregados);

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
              <table className="headerTable">
                <thead>
                  <tr>
                    {/* Aquí mapeamos las claves ajustadas, incluyendo las combinaciones de nombres */}
                    <th>Detalle Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <AgregarItems onAgregarItem={handleAgregarItem} />
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  {itemsAgregados.map((item, index) => (
                    <tr key={index}>
                      <td>{item.producto}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.precio}</td>
                      <td style={{ flexWrap: "nowrap" }}>
                        <EditarItem clienteSelected={cliente} />
                        <FaRegTrashAlt
                          className="iconABM"
                          /* onClick={() => handleDelete(cliente)} */
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
