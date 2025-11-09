import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  getVentasAPI,
  selectVentas,
  selectVentasPagination,
} from "../../redux/ventasSlice";
import { getClientesAPI } from "../../redux/clientesSlice";
import { MdReceiptLong } from "react-icons/md";
import { FaPrint } from "react-icons/fa";
import VentaFormModal from "./VentaForm";
import FacturaDetalle from "./FacturaDetalle";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

const DEFAULT_VENTAS_FILTERS = {
  fechaDesde: "",
  fechaHasta: "",
  numeroFactura: "",
  clienteId: "",
};

const createDefaultVentasFilters = () => ({ ...DEFAULT_VENTAS_FILTERS });

const Ventas = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(() => createDefaultVentasFilters());
  const [appliedFilters, setAppliedFilters] = useState(() =>
    createDefaultVentasFilters()
  );
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef(null);
  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const usuarioId = logged?.sesion?.usuario_id;
  const sesion = logged?.sesion?.sesion_id;

  const ventas = useSelector(selectVentas);
  const pagination = useSelector(selectVentasPagination);
  const clientes = useSelector(
    (state) => state?.cliente?.initialState || []
  );

  const {
    fechaDesde: appliedFechaDesde,
    fechaHasta: appliedFechaHasta,
    numeroFactura: appliedNumeroFactura,
    clienteId: appliedClienteId,
  } = appliedFilters;

  useEffect(() => {
    const pageSizeFull = 500;
    dispatch(getClientesAPI(1, pageSizeFull, "", null, null, sesion));
  }, [dispatch, sesion]);

  useEffect(() => {
    dispatch(
      getVentasAPI({
        page,
        pageSize,
        search: search.trim(),
        sesion,
        fechaDesde: appliedFechaDesde || undefined,
        fechaHasta: appliedFechaHasta || undefined,
        numeroFactura: appliedNumeroFactura || undefined,
        clienteId: appliedClienteId || undefined,
      })
    );
  }, [
    dispatch,
    page,
    pageSize,
    search,
    sesion,
    appliedFechaDesde,
    appliedFechaHasta,
    appliedNumeroFactura,
    appliedClienteId,
  ]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    const totalPages = pagination?.totalPages ?? 1;
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleFilterChange = (field) => (event) => {
    const value = event?.target?.value ?? "";
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const resetFilters = createDefaultVentasFilters();
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  const handleExportPDF = async () => {
    if (!tableRef.current) {
      Swal.fire({
        icon: "info",
        title: "Reporte vacío",
        text: "No hay información para exportar.",
      });
      return;
    }

    try {
      setIsExporting(true);
      const canvas = await html2canvas(tableRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const formattedDate = new Date().toISOString().split("T")[0];
      pdf.save(`reporte-ventas-${formattedDate}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF de ventas:", error);
      Swal.fire({
        icon: "error",
        title: "Error al generar PDF",
        text: "Ocurrió un problema al generar el reporte en PDF. Intenta nuevamente.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = pagination?.totalPages ?? 1;
  const totalRegistros = pagination?.total ?? ventas.length;

  return (
    <div className="containerSelected">
      <div className="headerSelected" style={{ gap: "12px" }}>
        <input
          className="inputSearch"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar ventas..."
        />
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="buttonPage"
            onClick={handleExportPDF}
            disabled={isExporting || ventas.length === 0}
            style={{ whiteSpace: "nowrap" }}
          >
            <FaPrint style={{ marginRight: "6px" }} />
            {isExporting ? "Generando PDF..." : "Imprimir PDF"}
          </button>
          <VentaFormModal usuarioId={usuarioId} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="fecha-desde">Fecha desde</label>
          <input
            id="fecha-desde"
            type="date"
            value={filters.fechaDesde}
            onChange={handleFilterChange("fechaDesde")}
            className="form-control"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="fecha-hasta">Fecha hasta</label>
          <input
            id="fecha-hasta"
            type="date"
            value={filters.fechaHasta}
            onChange={handleFilterChange("fechaHasta")}
            className="form-control"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="numero-factura">Número factura</label>
          <input
            id="numero-factura"
            type="text"
            value={filters.numeroFactura}
            onChange={handleFilterChange("numeroFactura")}
            className="form-control"
            placeholder="Ej: 00001234"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
            className="form-select"
            value={filters.clienteId}
            onChange={handleFilterChange("clienteId")}
          >
            <option value="">Todos</option>
            {Array.isArray(clientes) &&
              clientes.map((cliente) => (
                <option key={cliente.cliente_id} value={cliente.cliente_id}>
                  {`${cliente.Apellido || cliente.apellido || ""} ${cliente.Nombre || cliente.nombre || ""}`.trim() ||
                    cliente.cliente_id}
                </option>
              ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="buttonPage" onClick={handleApplyFilters}>
            Aplicar filtros
          </button>
          <button
            className="buttonPage"
            onClick={handleClearFilters}
            style={{ backgroundColor: "#6c757d" }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="containerTableAndPagesSelected" ref={tableRef}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 4px",
          }}
        >
          <h3 style={{ margin: 0 }}>Reporte de ventas</h3>
          <span style={{ fontSize: "0.9rem", color: "#555" }}>
            Registros: {totalRegistros}
          </span>
        </div>
        <table className="headerTable">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Número Factura</th>
              <th>Cliente</th>
              <th>Usuario</th>
              <th>Total sin descuento</th>
              <th>Descuento</th>
              <th>Total</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <tr key={venta.venta_id}>
                  <td>
                    {venta.fecha_hora
                      ? new Date(venta.fecha_hora).toLocaleString()
                      : "-"}
                  </td>
                  <td>{venta.numero_factura ?? "-"}</td>
                  <td>
                    {`${venta.cliente_nombre || ""} ${
                      venta.cliente_apellido || ""
                    }`.trim() || "-"}
                  </td>
                  <td>
                    {`${venta.usuario_nombre || ""} ${
                      venta.usuario_apellido || ""
                    }`.trim() || "-"}
                  </td>
                  <td>
                    $
                    {Number(venta.total_sin_descuento || 0).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </td>
                  <td>{Number(venta.descuento || 0).toFixed(2)}%</td>
                  <td>
                    $
                    {Number(venta.total || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <div style={{ display: "flex" }}>
                      <FacturaDetalle ventaId={venta.venta_id} total={venta.total} />
                      <MdReceiptLong
                        data-tooltip-id="my-tooltip-NC"
                        data-tooltip-content="Nota de Crédito"
                        className="iconABMDisabled"
                      />
                      <Tooltip id="my-tooltip-NC"> Nota de crédito</Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "24px" }}>
                  No se encontraron ventas con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "16px" }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="buttonPage"
        >
          Anterior
        </button>
        <span style={{ margin: "0 12px" }}>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="buttonPage"
          disabled={page >= totalPages || ventas.length === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Ventas;
