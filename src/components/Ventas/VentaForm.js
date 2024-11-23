import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addVentaAPI, getUltimaVentaAPI } from "../../redux/ventasSlice";
import { getClientesAPI } from "../../redux/clientesSlice";
import Select from "react-select";
import AgregarItems from "./AgregarItems";
import { FaRegTrashAlt } from "react-icons/fa";
import EditarItem from "./EditItems";
import Swal from "sweetalert2";
const VentaFormModal = ({ usuarioId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [cliente, setCliente] = useState(0);
  const [itemsAgregados, setItemsAgregados] = useState([]);
  const [total, setTotal] = useState(0);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const clientes = useSelector(
    (state) => state && state.cliente && state.cliente
  );
  const ultimaVenta = useSelector(
    (state) => state && state.venta && state.venta.ultimaVentaState
  );

  const items = useSelector((state) => state && state?.item?.initialState);
  useEffect(() => {
    dispatch(getClientesAPI());
    dispatch(getUltimaVentaAPI());
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

  const handleDelete = (item) => {
    Swal.fire({
      title: "Remover item",
      html: `Estas seguro de remover el item <b>${item.nombre}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!",
    }).then((result) => {
      if (result.isConfirmed) {
        setItemsAgregados((itemsAgregados) =>
          itemsAgregados.filter(
            (producto) => producto.productoId !== item.productoId
          )
        );
      }
    });
  };

  useEffect(() => {
    let total = 0;
    itemsAgregados.forEach((item) => {
      total += parseInt(item.total);
    });
    setTotal(total);
  }, [itemsAgregados]);

  const handleCrearFactura = () => {
    dispatch(
      addVentaAPI({
        cliente_id: cliente,
        itemsAgregados,
        total,
        usuario_id: usuarioId,
        numero_factura: ultimaVenta && ultimaVenta?.venta_id + 1,
      })
    );
    handleClose();
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
          <Modal.Title>
            Nueva Factura N°00000000{ultimaVenta && ultimaVenta?.venta_id + 1}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                    placeholder="Selectcionar Cliente"
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
                  {itemsAgregados.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.precio}</td>
                      <td style={{ flexWrap: "nowrap" }}>
                        {/*        <EditarItem clienteSelected={cliente} /> */}
                        <FaRegTrashAlt
                          className="iconABM"
                          onClick={() => handleDelete(item)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Form.Group>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button className="buttonConfirm" onClick={handleCrearFactura}>
                Crear Factura
              </Button>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {`Total: $${total}`}
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VentaFormModal;
