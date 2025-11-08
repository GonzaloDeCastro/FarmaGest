import React, { useEffect, useState } from "react";
import styles from "./Ventas.module.css";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addVentaAPI, getUltimaVentaAPI, getVentasByClienteAPI } from "../../redux/ventasSlice";
import { getClientesAPI } from "../../redux/clientesSlice";
import { getObrasSocialesAPI } from "../../redux/obrasSocialesSlice";
import { getProductosAPI, getCategoriasAPI } from "../../redux/productosSlice";
import Select from "react-select";
import AgregarItems from "./AgregarItems";
import { FaRegTrashAlt } from "react-icons/fa";
import EditarItem from "./EditItems";
import Swal from "sweetalert2";
import VentaBuilder from "../../patterns/builders/VentaBuilder";
import SelectAdapter from "../../patterns/adapters/SelectAdapter";
import ProductRecommendations from "./ProductRecommendations";
const VentaFormModal = ({ usuarioId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [cliente, setCliente] = useState(0);
  const [itemsAgregados, setItemsAgregados] = useState([]);
  const [obraSocial, setObraSocial] = useState({
    obra_social: "Sin obra social",
    Descuento: 0,
    descuento: 0,
  });
  const [total, setTotal] = useState(0);
  const today = new Date();

  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged?.sesion?.sesion_id;

  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T${String(
    today.getHours()
  ).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

  const [dateSelectedFrom, setDateSelectedFrom] = useState(formattedToday);

  const normalizeDiscount = (value) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) {
      return 0;
    }
    return parsed > 1 ? parsed / 100 : parsed;
  };

  const handleClose = () => {
    setShow(false);
    setCliente(0);
    setItemsAgregados([]);
    setObraSocial({
      obra_social: "Sin obra social",
      Descuento: 0,
      descuento: 0,
    });
    setVentasCliente([]);
  };

  const handleShow = () => setShow(true);

  const clientesState = useSelector((state) => state?.cliente);
  const clientes = clientesState?.initialState || [];
  const obrasSociales = useSelector(
    (state) => state?.obrasocial?.initialState || []
  );
  const ultimaVenta = useSelector((state) => state?.venta?.ultimaVentaState);

  const productos = useSelector((state) => state.producto?.initialState || []);
  const ventasHistoricas = useSelector((state) => state.venta?.initialState || []);
  const [ventasCliente, setVentasCliente] = useState([]);

  useEffect(() => {
    const pageSizeFull = 999;
    dispatch(getClientesAPI(1, pageSizeFull, "", null, null, sesion));
    dispatch(getUltimaVentaAPI());
    dispatch(getObrasSocialesAPI(1, pageSizeFull));
    dispatch(
      getProductosAPI({
        page: 1,
        pageSize: pageSizeFull,
        search: "",
        sesion,
      })
    );
    dispatch(getCategoriasAPI());
  }, [dispatch, sesion, show]);

  // Cargar historial de ventas del cliente cuando se selecciona
  useEffect(() => {
    const loadClienteHistory = async () => {
      if (cliente && cliente !== 0) {
        try {
          // Intentar obtener historial específico del cliente
          const ventas = await dispatch(getVentasByClienteAPI(cliente));
          if (ventas && Array.isArray(ventas) && ventas.length > 0) {
            setVentasCliente(ventas);
          } else {
            // Si no hay endpoint específico, usar ventas generales como fallback
            setVentasCliente([]);
          }
        } catch (error) {
          console.warn("No se pudo cargar historial específico del cliente, usando ventas generales:", error);
          setVentasCliente([]);
        }
      } else {
        setVentasCliente([]);
      }
    };

    loadClienteHistory();
  }, [cliente, dispatch]);

  // Usar Adapter Pattern para transformar clientes a formato de react-select
  const optionsClientes = SelectAdapter.clienteToSelectOptions(clientes);

  const handleCliente = (event) => {
    const selectedValue = event.target.value;
    const selectedCliente = selectedValue ? Number(selectedValue) : 0;
    setCliente(selectedCliente);
    const clienteSeleccionado = clientes.find(
      (c) => c.cliente_id === selectedCliente
    );
    const obraSocialID = clienteSeleccionado?.obra_social_id;
    const obraSocialEncontrada = Array.isArray(obrasSociales)
      ? obrasSociales.find((o) => o.obra_social_id === obraSocialID)
      : null;

    if (obraSocialEncontrada) {
      const normalizedDiscount = normalizeDiscount(
        obraSocialEncontrada.Descuento ?? obraSocialEncontrada.descuento
      );
      setObraSocial({
        ...obraSocialEncontrada,
        obra_social: obraSocialEncontrada.obra_social,
        Descuento: normalizedDiscount,
        descuento: normalizedDiscount,
      });
    } else {
      setObraSocial({
        obra_social: "Sin obra social",
        Descuento: 0,
        descuento: 0,
      });
    }
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
    const totalCalculado = itemsAgregados.reduce(
      (acc, item) => acc + (parseFloat(item.total) || 0),
      0
    );

    setTotal(totalCalculado);
  }, [itemsAgregados]);

  const handleCrearFactura = () => {
    try {
      // Usar Builder Pattern para construir el objeto de venta
      const ventaData = new VentaBuilder()
        .setCliente(cliente)
        .setItems(itemsAgregados)
        .setObraSocial(obraSocial)
        .calculateTotal()
        .applyDescuento()
        .setUsuario(usuarioId)
        .setNumeroFactura(ultimaVenta && ultimaVenta?.venta_id + 1)
        .setFechaHora(dateSelectedFrom)
        .build();

      dispatch(addVentaAPI(ventaData));
      handleClose();
      setCliente(0);
      setItemsAgregados([]);
      setDateSelectedFrom(formattedToday);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: error.message,
      });
    }
  };
  const handleSelectDateFrom = (e) => {
    setDateSelectedFrom(e.target.value);
  };

  const descuentoActual = normalizeDiscount(
    obraSocial?.Descuento ?? obraSocial?.descuento ?? 0
  );

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
                      {obraSocial?.obra_social ?? "Sin obra social"}
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
                      🔥 Descuento {(descuentoActual * 100).toFixed(0)}%
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
                    <th style={{ width: "1%", whiteSpace: "nowrap" }}>
                      <AgregarItems onAgregarItem={handleAgregarItem} />
                    </th>
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

            {/* Componente de Recomendaciones IA */}
            {cliente !== 0 && productos.length > 0 && (
              <ProductRecommendations
                clienteId={cliente}
                ventasHistoricas={ventasCliente.length > 0 ? ventasCliente : ventasHistoricas}
                productos={productos}
                itemsYaAgregados={itemsAgregados}
                onAddProduct={handleAgregarItem}
              />
            )}

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
              <div className={styles.contenedorResumen}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={styles.subTotal}>SubTotal:</div>
                  <div className={styles.valorSubTotal}>
                    ${total.toFixed(2)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={styles.total}>Total:</div>
                  <div className={styles.valorTotal}>
                    $
                    {total !== 0
                      ? (total * (1 - descuentoActual)).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VentaFormModal;
