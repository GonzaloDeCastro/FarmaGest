import React, { useState, useEffect, useRef } from "react";
import styles from "./Ventas.module.css";
import { Button, Modal } from "react-bootstrap";
import { FaFileInvoice, FaPrint } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { verFacturaVentaAPI } from "../../redux/ventasSlice";
import { Tooltip } from "react-tooltip";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const FacturaDetalle = ({ ventaId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const facturaDetalle = useSelector((state) => state.venta.facturaState || {});

  useEffect(() => {
    if (show) {
      dispatch(verFacturaVentaAPI(ventaId));
    }
  }, [dispatch, ventaId, show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const facturaRef = useRef();

  const handleDownloadPDF = () => {
    const input = facturaRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // Margen inicial

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("factura_detalle.pdf"); // Nombre del archivo PDF
    });
  };

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
          <Modal.Title className={styles.modalTitle}>
            Detalle de la Factura
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <div ref={facturaRef}>
            <p className={styles.encabezadoFactura}>
              <strong>Factura N°:</strong> {facturaDetalle.venta_id}
            </p>
            <p className={styles.encabezadoFactura}>
              <strong>Fecha y hora:</strong>{" "}
              {new Date(facturaDetalle.fecha_hora).toLocaleString()}
            </p>
            <p className={styles.encabezadoFactura}>
              <strong>Cliente:</strong> {facturaDetalle.cliente_nombre}{" "}
              {facturaDetalle.cliente_apellido}
            </p>
            <p className={styles.encabezadoFactura}>
              <strong>Vendedor:</strong> {facturaDetalle.usuario_nombre}{" "}
              {facturaDetalle.usuario_apellido}
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {facturaDetalle.items?.map((item) => (
                  <tr key={item.item_id}>
                    <td>{item.producto_nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio_unitario}</td>
                    <td>${item.total_item}</td>
                  </tr>
                ))}
              </tbody>
            </table>{" "}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#333",
                backgroundColor: "#f9f9f9",
                padding: "10px 15px",
                borderRadius: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Total:${facturaDetalle?.total}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            <FaPrint style={{ marginRight: "5px" }} /> Imprimir PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FacturaDetalle;
