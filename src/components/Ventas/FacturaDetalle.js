import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaFileInvoice } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { verFacturaVentaAPI } from "../../redux/ventasSlice";
import { Tooltip } from "react-tooltip";
const FacturaDetalle = ({ ventaId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const facturaDetalle = useSelector((state) => state.venta.facturaState || {});

  useEffect(() => {
    dispatch(verFacturaVentaAPI(ventaId));
  }, [dispatch, ventaId, show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="buttonOpenModal" onClick={handleShow}>
        <FaFileInvoice
          className="iconABM"
          data-tooltip-id="my-tooltip-F"
          data-tooltip-content="Ver Factura"
        />
        <Tooltip id="my-tooltip-F"> Ver Factura</Tooltip>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalle de la Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Venta ID:</strong> {facturaDetalle.venta_id}
          </p>
          <p>
            <strong>Fecha y hora:</strong>{" "}
            {new Date(facturaDetalle.fecha_hora).toLocaleString()}
          </p>
          <p>
            <strong>Cliente:</strong> {facturaDetalle.cliente_nombre}{" "}
            {facturaDetalle.cliente_apellido}
          </p>
          <p>
            <strong>Vendedor:</strong> {facturaDetalle.usuario_nombre}{" "}
            {facturaDetalle.usuario_apellido}
          </p>
          <p>
            <strong>Total:</strong> ${facturaDetalle.total}
          </p>
          <h5>Items:</h5>
          <ul>
            {facturaDetalle.items?.map((item) => (
              <li key={item.item_id}>
                {item.producto_nombre} - {item.cantidad} x $
                {item.precio_unitario} = ${item.total_item}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FacturaDetalle;
