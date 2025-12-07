import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getObrasSocialesAPI } from "../../redux/obrasSocialesSlice";
import {
  fetchLiquidacionObrasSocialesAPI,
  sendLiquidacionObrasSocialesEmailAPI,
  resetLiquidacionObrasSociales,
} from "../../redux/liquidacionObrasSocialesSlice";
import styles from "./Auditoria.module.css";
import Swal from "sweetalert2";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("es-AR");
};

const LiquidacionObrasSociales = () => {
  const dispatch = useDispatch();
  const obrasSociales = useSelector(
    (state) => state.obrasocial?.initialState || []
  );
  const liquidacion = useSelector(
    (state) => state.liquidacionObrasSociales || {}
  );

  const printableRef = useRef(null);

  const [filters, setFilters] = useState({
    obraSocialId: "",
    fechaDesde: "",
    fechaHasta: "",
    incluirSinObraSocial: false,
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");

  const {
    resumen = [],
    totales = {},
    loading,
    error,
    emailSending = false,
  } = liquidacion;

  useEffect(() => {
    if (!Array.isArray(obrasSociales) || obrasSociales.length === 0) {
      const pageSizeFull = 500;
      dispatch(getObrasSocialesAPI(1, pageSizeFull));
    }
  }, [dispatch, obrasSociales]);

  useEffect(() => {
    dispatch(fetchLiquidacionObrasSocialesAPI());
    return () => {
      dispatch(resetLiquidacionObrasSociales());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(fetchLiquidacionObrasSocialesAPI(filters));
  };

  const handleReset = () => {
    const initialFilters = {
      obraSocialId: "",
      fechaDesde: "",
      fechaHasta: "",
      incluirSinObraSocial: false,
    };
    setFilters(initialFilters);
    dispatch(fetchLiquidacionObrasSocialesAPI(initialFilters));
  };

  const resumenOrdenado = useMemo(
    () =>
      Array.isArray(resumen)
        ? [...resumen].sort((a, b) =>
            (a.obra_social || "").localeCompare(b.obra_social || "")
          )
        : [],
    [resumen]
  );

  // Obras sociales únicas por nombre para el dropdown
  const obrasSocialesUnicas = useMemo(() => {
    if (!Array.isArray(obrasSociales) || obrasSociales.length === 0) {
      return [];
    }

    // Función para normalizar nombres (eliminar espacios, convertir a minúsculas, sin caracteres especiales)
    const normalizarNombre = (nombre) => {
      return (nombre || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ") // Normalizar espacios múltiples
        .replace(/[^a-z0-9\s]/g, "") // Eliminar caracteres especiales
        .replace(/\s+/g, ""); // Eliminar todos los espacios
    };

    // Crear un mapa para eliminar duplicados basándose en el nombre normalizado
    const obrasUnicasMap = new Map();

    obrasSociales.forEach((obra) => {
      const nombreNormalizado = normalizarNombre(obra.obra_social);
      
      // Si no existe en el mapa, agregarlo
      if (!obrasUnicasMap.has(nombreNormalizado)) {
        obrasUnicasMap.set(nombreNormalizado, obra);
      } else {
        const existente = obrasUnicasMap.get(nombreNormalizado);
        // Mantener el que tenga el ID más bajo
        if (obra.obra_social_id < existente.obra_social_id) {
          obrasUnicasMap.set(nombreNormalizado, obra);
        }
      }
    });

    // Convertir el mapa a array y ordenar
    return Array.from(obrasUnicasMap.values()).sort((a, b) =>
      (a.obra_social || "").localeCompare(b.obra_social || "")
    );
  }, [obrasSociales]);

  const handlePrint = () => {
    const printNode = printableRef.current;
    if (!printNode) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay contenido para imprimir.",
      });
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=650");
    if (!printWindow) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo abrir la ventana de impresión.",
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Liquidación de Obras Sociales</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 24px; color: #333; }
            h1, h2, h3 { color: #1f2937; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #cccccc; padding: 8px; font-size: 12px; }
            th { background-color: #f3f3f3; text-align: left; }
            hr { border: none; border-top: 1px solid #dddddd; margin: 24px 0; }
          </style>
        </head>
        <body>
          <h1>Liquidación de Obras Sociales</h1>
          ${printNode.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();
    const email = emailDestino.trim();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Dato faltante",
        text: "Ingresá al menos una dirección de correo.",
      });
      return;
    }

    try {
      await dispatch(
        sendLiquidacionObrasSocialesEmailAPI({
          to: email,
          obraSocialId: filters.obraSocialId,
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta,
          incluirSinObraSocial: filters.incluirSinObraSocial,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: "La liquidación se envió correctamente.",
      });
      setEmailDestino("");
      setShowEmailForm(false);
    } catch (err) {
      const errorMensaje =
        err?.response?.data?.mensaje ||
        liquidacion.emailError ||
        "No se pudo enviar la liquidación por correo.";
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: errorMensaje,
      });
    }
  };

  return (
    <div className={styles.liquidacionWrapper}>
      <form className={styles.liquidacionFilters} onSubmit={handleSubmit}>
        <div className={styles.liquidacionFilterGroup}>
          <label htmlFor="obraSocialId">Obra social</label>
          <select
            id="obraSocialId"
            name="obraSocialId"
            value={filters.obraSocialId}
            onChange={handleChange}
            className="buttonSelect"
          >
            <option value="">Todas</option>
            {obrasSocialesUnicas.map((obra) => (
              <option
                key={obra.obra_social_id}
                value={obra.obra_social_id}
              >
                {obra.obra_social}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.liquidacionFilterGroup}>
          <label htmlFor="fechaDesde">Fecha desde</label>
          <input
            id="fechaDesde"
            name="fechaDesde"
            type="date"
            value={filters.fechaDesde}
            onChange={handleChange}
            className={styles.liquidacionDateInput}
          />
        </div>

        <div className={styles.liquidacionFilterGroup}>
          <label htmlFor="fechaHasta">Fecha hasta</label>
          <input
            id="fechaHasta"
            name="fechaHasta"
            type="date"
            value={filters.fechaHasta}
            onChange={handleChange}
            className={styles.liquidacionDateInput}
          />
        </div>

        <div className={styles.liquidacionCheckboxWrapper}>
          <label htmlFor="incluirSinObraSocial" className={styles.checkboxLabel}>
            <input
              id="incluirSinObraSocial"
              name="incluirSinObraSocial"
              type="checkbox"
              checked={filters.incluirSinObraSocial}
              onChange={handleChange}
            />
            Incluir ventas sin obra social
          </label>
        </div>

        <div className={styles.liquidacionActions}>
          <button type="submit" className="buttonConfirm">
            Buscar
          </button>
          <button
            type="button"
            className="buttonCancel"
            onClick={handleReset}
          >
            Limpiar
          </button>
        </div>
      </form>

      <div className={styles.liquidacionActionsBar}>
        <button
          type="button"
          className="buttonConfirm"
          onClick={handlePrint}
          disabled={loading}
        >
          Imprimir
        </button>
        <button
          type="button"
          className="buttonPage"
          onClick={() => setShowEmailForm((prev) => !prev)}
          disabled={loading}
        >
          {showEmailForm ? "Cancelar envío" : "Enviar por correo"}
        </button>
      </div>

      {showEmailForm && (
        <form className={styles.liquidacionEmailForm} onSubmit={handleSendEmail}>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
            className={styles.liquidacionEmailInput}
            required
          />
          <button
            type="submit"
            className="buttonConfirm"
            disabled={emailSending}
          >
            {emailSending ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}

      {loading ? (
        <div className={styles.liquidacionMessage}>Cargando liquidación...</div>
      ) : error ? (
        <div className={styles.liquidacionError}>{error}</div>
      ) : (
        <div ref={printableRef}>
          <div className={styles.liquidacionSummary}>
            <div className={styles.liquidacionSummaryCard}>
              <span className={styles.liquidacionSummaryLabel}>
                Cantidad de ventas
              </span>
              <strong>{totales.cantidad_ventas || 0}</strong>
            </div>
            <div className={styles.liquidacionSummaryCard}>
              <span className={styles.liquidacionSummaryLabel}>
                Subtotal facturado
              </span>
              <strong>{formatCurrency(totales.subtotal_total)}</strong>
            </div>
            <div className={styles.liquidacionSummaryCard}>
              <span className={styles.liquidacionSummaryLabel}>
                Aporte obras sociales
              </span>
              <strong>{formatCurrency(totales.aporte_obra_social)}</strong>
            </div>
            <div className={styles.liquidacionSummaryCard}>
              <span className={styles.liquidacionSummaryLabel}>
                Total abonado por pacientes
              </span>
              <strong>{formatCurrency(totales.total_paciente)}</strong>
            </div>
          </div>

          {resumenOrdenado.length === 0 ? (
            <div className={styles.liquidacionMessage}>
              No se encontraron ventas para los filtros seleccionados.
            </div>
          ) : (
            resumenOrdenado.map((grupo) => (
              <div
                key={grupo.obra_social_id ?? "sin-obra-social"}
                className={styles.liquidacionGroup}
              >
                <div className={styles.liquidacionGroupHeader}>
                  <div>
                    <h3>{grupo.obra_social}</h3>
                    {grupo.plan && (
                      <span className={styles.liquidacionPlan}>
                        Plan: {grupo.plan}
                      </span>
                    )}
                  </div>
                  <div className={styles.liquidacionGroupMetrics}>
                    <div>
                      <span className={styles.liquidacionSummaryLabel}>
                        Ventas
                      </span>
                      <strong>{grupo.cantidad_ventas}</strong>
                    </div>
                    <div>
                      <span className={styles.liquidacionSummaryLabel}>
                        Subtotal
                      </span>
                      <strong>{formatCurrency(grupo.subtotal_total)}</strong>
                    </div>
                    <div>
                      <span className={styles.liquidacionSummaryLabel}>
                        Aporte obra social
                      </span>
                      <strong>
                        {formatCurrency(grupo.aporte_obra_social)}
                      </strong>
                    </div>
                    <div>
                      <span className={styles.liquidacionSummaryLabel}>
                        Total paciente
                      </span>
                      <strong>{formatCurrency(grupo.total_paciente)}</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.liquidacionTableWrapper}>
                  <table className={styles.headerTable}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>N° factura</th>
                        <th>Cliente</th>
                        <th>DNI</th>
                        <th>Subtotal</th>
                        <th>Descuento %</th>
                        <th>Aporte obra social</th>
                        <th>Total paciente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.detalle.map((venta) => (
                        <tr key={venta.venta_id}>
                          <td>{formatDate(venta.fecha)}</td>
                          <td>{venta.numero_factura}</td>
                          <td>
                            {[
                              venta.cliente?.nombre,
                              venta.cliente?.apellido,
                            ]
                              .filter(Boolean)
                              .join(" ") || "—"}
                          </td>
                          <td>{venta.cliente?.dni || "—"}</td>
                          <td>{formatCurrency(venta.subtotal)}</td>
                          <td>
                            {Number(venta.descuento_porcentaje || 0).toFixed(2)}%
                          </td>
                          <td>{formatCurrency(venta.aporte_obra_social)}</td>
                          <td>{formatCurrency(venta.total_paciente)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LiquidacionObrasSociales;

