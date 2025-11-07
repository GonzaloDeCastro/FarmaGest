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

  const formatearMoneda = (valor) =>
    Number(valor || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const fechaReferencia = facturaDetalle?.fecha_hora || facturaDetalle?.fecha;
  const fechaFormateada = fechaReferencia
    ? new Date(fechaReferencia).toLocaleString()
    : "-";

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
              <strong>Factura N°:</strong> {facturaDetalle.numero_factura || facturaDetalle.venta_id}
            </p>
            <p className={styles.encabezadoFactura}>
              <strong>Fecha y hora:</strong> {fechaFormateada}
            </p>
            <p className={styles.encabezadoFactura}>
              <strong>Cliente:</strong> {facturaDetalle.cliente_nombre} {facturaDetalle.cliente_apellido}
            </p>
            <p className={styles.encabezadoFactura}>
              <strong>Vendedor:</strong> {facturaDetalle.usuario_nombre} {facturaDetalle.usuario_apellido}
            </p>
            {facturaDetalle.obra_social && (
              <p className={styles.encabezadoFactura}>
                <strong>Obra Social:</strong> {facturaDetalle.obra_social}
              </p>
            )}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {facturaDetalle.items?.length ? (
                  facturaDetalle.items.map((item) => (
                    <tr key={item.item_id}>
                      <td>{item.producto_nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>${formatearMoneda(item.precio_unitario)}</td>
                      <td>${formatearMoneda(item.subtotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      Sin items cargados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.contenedorTotal}>
              Total sin descuento:
              <span className={styles.valorSubTotal}>
                ${formatearMoneda(facturaDetalle.total_sin_descuento)}
              </span>
            </div>
            <div className={styles.contenedorTotal}>
              Descuento aplicado:
              <span className={styles.valorDescuento}>
                {facturaDetalle.descuento_porcentaje}% (
                ${formatearMoneda(facturaDetalle.descuento_monto)})
              </span>
            </div>
            <div className={styles.contenedorTotal}>
              Subtotal con descuento:
              <span className={styles.valorSubTotal}>
                ${formatearMoneda(facturaDetalle.subtotal_con_descuento)}
              </span>
            </div>
            <div className={styles.contenedorTotal}>
              IVA {facturaDetalle.iva_porcentaje}%:
              <span className={styles.valorSubTotal}>
                ${formatearMoneda(facturaDetalle.iva_monto)}
              </span>
            </div>
            <div className={styles.contenedorTotal}>
              Total:
              <span className={styles.valorTotal}>
                ${formatearMoneda(facturaDetalle.total)}
              </span>
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
