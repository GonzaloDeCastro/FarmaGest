import React, { useState, useEffect, useRef } from "react";
import styles from "./Ventas.module.css";
import { Button, Modal, Table } from "react-bootstrap";
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
    dispatch(verFacturaVentaAPI(ventaId));
  }, [dispatch, ventaId, show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const facturaRef = useRef();

  const handleDownloadPDF = () => {
    const input = facturaRef.current;
    console.log("input", input);
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
            <p>
              <strong>Factura N°:</strong> {facturaDetalle.venta_id}
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
            <h5>Items</h5>
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
            </table>
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
