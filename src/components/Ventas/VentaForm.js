import React, { useEffect, useState } from "react";
import styles from "./Ventas.module.css";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addVentaAPI, getUltimaVentaAPI } from "../../redux/ventasSlice";
import { getClientesAPI } from "../../redux/clientesSlice";
import { getObrasSocialesAPI } from "../../redux/obrasSocialesSlice";
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
  const [obraSocial, setObraSocial] = useState([]);
  const [total, setTotal] = useState(0);
  const today = new Date();

  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T${String(
    today.getHours()
  ).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

  const [dateSelectedFrom, setDateSelectedFrom] = useState(formattedToday);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const clientes = useSelector(
    (state) => state && state.cliente && state.cliente
  );
  const obrasSociales = useSelector(
    (state) =>
      state &&
      state.cliente &&
      state.obrasocial &&
      state.obrasocial.initialState
  );
  const ultimaVenta = useSelector(
    (state) => state && state.venta && state.venta.ultimaVentaState
  );

  const items = useSelector((state) => state && state?.item?.initialState);
  useEffect(() => {
    dispatch(getClientesAPI());
    dispatch(getUltimaVentaAPI());
    dispatch(getObrasSocialesAPI(0, 999));
  }, [dispatch, items, show]);

  let optionsClientes =
    clientes &&
    clientes?.initialState?.map((cliente) => ({
      value: cliente.cliente_id,
      label: `${cliente.DNI} - ${cliente.Apellido} ${cliente.Nombre}`,
    }));

  const handleCliente = (event) => {
    const selectedCliente = event.target.value;
    setCliente(selectedCliente);
    const obraSocialID = clientes?.initialState?.find(
      (c) => c.cliente_id == selectedCliente
    ).obra_social_id;
    const obraSocialEncontrada =
      obrasSociales &&
      obrasSociales?.find((o) => o.obra_social_id == obraSocialID);
    setObraSocial(obraSocialEncontrada);
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
    let totalConDescuento = (total * (1 - obraSocial.Descuento)).toFixed(2);
    let totalSinDescuento = total.toString();
    dispatch(
      addVentaAPI({
        cliente_id: cliente,
        itemsAgregados,
        totalConDescuento,
        totalSinDescuento,
        usuario_id: usuarioId,
        numero_factura: ultimaVenta && ultimaVenta?.venta_id + 1,
        fecha_hora: dateSelectedFrom,
      })
    );
    handleClose();
    setCliente(0);
    setItemsAgregados([]);
    setDateSelectedFrom(formattedToday);
  };
  const handleSelectDateFrom = (e) => {
    setDateSelectedFrom(e.target.value);
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
            <Form.Group
              className="mb-3"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className={styles.containerDate}>
                <label style={{ display: "block" }} htmlFor="code">
                  Fecha:
                </label>
                <input
                  type="datetime-local"
                  className={styles.formSelectDate}
                  style={{ border: "none" }}
                  onChange={handleSelectDateFrom}
                  value={dateSelectedFrom}
                />
              </div>
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
                    placeholder="Seleccionar Cliente"
                    classNamePrefix="react-select"
                  />
                )}
                {}
              </div>

              {cliente !== 0 && (
                <div
                  className="form-group col-md-6"
                  style={{ width: "30%", fontSize: "15px", marginLeft: "10px" }}
                >
                  <label style={{ display: "block", marginLeft: "10px" }}>
                    Obra Social:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center", // Alinea con los demás elementos
                      marginLeft: "10px",
                      padding: "5px 15px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #ff9800, #ff5722)", // Gradiente llamativo
                      color: "white",
                      fontWeight: "bold",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {obraSocial.obra_social}
                    </div>
                    <div
                      style={{
                        marginLeft: "10px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: "#fff",
                        color: "#d32f2f",
                        padding: "3px 8px",
                        borderRadius: "5px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      🔥 Descuento {obraSocial.Descuento * 100}%
                    </div>
                  </div>
                </div>
              )}
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
              <Button
                className="buttonConfirm"
                onClick={handleCrearFactura}
                disabled={itemsAgregados.length === 0}
              >
                Crear Factura
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  background: "#f8f9fa", // Color suave de fondo
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Sombra ligera
                  width: "100%",
                  maxWidth: "400px", // Controlar el ancho
                  marginRight: "2.2%",
                }}
              >
                <span style={{ color: "#333" }}>SubTotal:</span>
                <span
                  style={{
                    color: "#007fff",
                    fontSize: "22px",
                    fontWeight: "bold",
                    backgroundColor: "#baddff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  ${total.toFixed(2)}
                </span>

                <span
                  style={{
                    color: "#333",
                    marginLeft: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Total:
                </span>
                <span
                  style={{
                    color: "#28a745",
                    fontSize: "22px",
                    fontWeight: "bold",
                    backgroundColor: "#d4edda",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  $
                  {total != 0
                    ? (total * (1 - obraSocial.Descuento)).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VentaFormModal;
