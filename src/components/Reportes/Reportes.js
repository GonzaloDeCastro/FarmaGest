import React, { useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";

import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Reportes.module.css";
import { getClientesAPI } from "../../redux/clientesSlice";
import { getProductosAPI, selectProductos } from "../../redux/productosSlice";
import { getUsuariosAPI } from "../../redux/usuariosSlice";
import { getReportesAPI } from "../../redux/reportesSlice";
import { FaTableList } from "react-icons/fa6";
import { BiBarChartAlt2 } from "react-icons/bi";
import Swal from "sweetalert2";
import { VisualizationStrategyFactory } from "../../patterns/strategies/VisualizationStrategy";
import { ExcelExportStrategy } from "../../patterns/strategies/ExportStrategy";

const Reportes = () => {
  const dispatch = useDispatch();

  const reportes = useSelector((state) => state.reporte.initialState || []);
  const [clienteProductoVendedor, setClienteProductoVendedor] = useState("");
  const [grafico, setGrafico] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const today = new Date();
  const lastTenDays = new Date();
  lastTenDays.setDate(today.getDate() - 10);

  const year = lastTenDays.getFullYear();
  const month = String(lastTenDays.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
  const day = String(lastTenDays.getDate()).padStart(2, "0"); // Día del mes

  const lastWeekFormatted = `${year}-${month}-${day}`;
  const [dateSelectedFrom, setDateSelectedFrom] = useState("");
  const [dateSelectedTo, setDateSelectedTo] = useState("");

  const [entitySelected, setSelectEntity] = useState("");
  const [optionEntities, setSelectOptionEntities] = useState("");
  useEffect(() => {
    dispatch(
      getReportesAPI(
        dateSelectedFrom,
        dateSelectedTo,
        entitySelected,
        clienteProductoVendedor
      )
    );
  }, []);

  const clientes = useSelector(
    (state) => (state && state.cliente && state.cliente) || []
  );
  const productos = useSelector(selectProductos);

  const usuarios = useSelector(
    (state) => (state && state?.usuario && state?.usuario) || []
  );

  const handleSelectDateFrom = (e) => {
    setDateSelectedFrom(e.target.value);
    setDisabled(true);
  };

  const handleSelectDateTo = (e) => {
    setDateSelectedTo(e.target.value);
    setDisabled(true);
  };

  const handleChangeEntity = (e) => {
    setSelectEntity(e.target.value);
    if (e.target.value === "Cliente") {
      dispatch(getClientesAPI());
      setClienteProductoVendedor("");
    }
    if (e.target.value === "Producto") {
      dispatch(getProductosAPI());
      setClienteProductoVendedor("");
    }
    if (e.target.value === "Vendedor") {
      dispatch(getUsuariosAPI());
      setClienteProductoVendedor("");
    }
  };
  const handleClienteProductoVendedor = (event) => {
    setClienteProductoVendedor(event.target.value);
  };
  useEffect(() => {
    if (entitySelected === "Cliente") {
      let optionsClientes =
        clientes &&
        clientes?.initialState?.map((cliente) => ({
          value: cliente.cliente_id,
          label: `${cliente.Apellido} ${cliente.Nombre}`,
        }));
      setSelectOptionEntities(optionsClientes);
    }
    if (entitySelected === "Producto") {
      const optionsProductos = Array.isArray(productos)
        ? productos.map((producto) => ({
            value: producto.producto_id,
            label: `${producto.Nombre ?? producto.nombre ?? ""}`,
          }))
        : [];
      setSelectOptionEntities(optionsProductos);
    }

    if (entitySelected === "Vendedor") {
      let optionsVendedores =
        usuarios &&
        usuarios?.initialState
          ?.filter((usuario) => usuario.rol_id === 2 || usuario.rol_id === 1)
          ?.map((usuario) => ({
            value: usuario.usuario_id,
            label: `${usuario.Apellido} ${usuario.Nombre}`,
          }));
      setSelectOptionEntities(optionsVendedores);
    }
  }, [entitySelected, clientes, productos, usuarios]);

  const handleAplicar = () => {
    setDisabled(false);
    dispatch(
      getReportesAPI(
        dateSelectedFrom,
        dateSelectedTo,
        entitySelected,
        clienteProductoVendedor
      )
    );
  };

  // Preparar datos para visualización
  const data = reportes && reportes.length > 0
    ? reportes
        .map((item) => ({
          fecha: new Date(item.fecha).toISOString().split("T")[0],
          cantidad_ventas: parseFloat(item.cantidad_ventas),
          monto: parseFloat(item.monto_total),
        }))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    : [];

  // Usar Strategy Pattern para exportación
  const exportStrategy = new ExcelExportStrategy();

  const handleExportExcel = (data, fileName) => {
    // Usar Strategy Pattern para generar nombre de archivo y mensaje
    const finalFileName = exportStrategy.generateFileName(
      fileName,
      dateSelectedFrom,
      dateSelectedTo
    );
    const mensajeExportar = exportStrategy.generateMessage(
      dateSelectedFrom,
      dateSelectedTo
    );

    Swal.fire({
      title: "Exportar a Excel",
      html: `${mensajeExportar}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, exportar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        exportStrategy.export(data, finalFileName);
        Swal.fire({
          title: "Exportación completada",
          text: `El archivo "${finalFileName}.xlsx" ha sido descargado.`,
          icon: "success",
        });
      }
    });
  };

  const [contador, setContador] = useState(0);

  // Determinar tipo de visualización según estado
  const getVisualizationType = () => {
    if (!grafico) return "table";
    return contador % 2 === 0 ? "amount-chart" : "quantity-chart";
  };

  // Crear estrategia de visualización
  const visualizationStrategy = VisualizationStrategyFactory.createStrategy(
    getVisualizationType(),
    data,
    styles
  );

  return (
    <div className={styles.containerSelected}>
      <div className={styles.containerHeader}>
        <div className={styles.header}>
          <div className={styles.containerDate}>
            Fecha Desde{" "}
            <input
              type="date"
              className={styles.formSelectDate}
              style={{ border: "none" }}
              onChange={handleSelectDateFrom}
              value={dateSelectedFrom}
              max={dateSelectedTo}
            />
          </div>
          <div className={styles.containerDate}>
            Fecha Hasta{" "}
            <input
              type="date"
              className={styles.formSelectDate}
              style={{ border: "none" }}
              onChange={handleSelectDateTo}
              value={dateSelectedTo}
              min={dateSelectedFrom}
            />
          </div>{" "}
          {/* 
          <div className={styles.containerDate}>
            Entidad{" "}
            <select
              value={entitySelected}
              className={styles.formSelectDate}
              onChange={handleChangeEntity}
              style={{ fontWeight: "bold" }}
            >
              <option value="" className="default-option">
                Todas
              </option>
              <option key={1} value={"Cliente"}>
                {"Cliente"}
              </option>
              <option key={2} value={"Vendedor"}>
                {"Vendedor"}
              </option>
              <option key={3} value={"Producto"}>
                {"Producto"}
              </option>
            </select>
          </div>
          {optionEntities &&
            optionEntities.length > 0 &&
            (entitySelected === "Cliente" ||
              entitySelected === "Vendedor" ||
              entitySelected === "Producto") && (
              <div
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              >
                <Select
                  value={
                    (optionEntities &&
                      optionEntities?.find(
                        (option) => option.value === clienteProductoVendedor
                      )) ||
                    null
                  }
                  onChange={(option) =>
                    handleClienteProductoVendedor({
                      target: { value: option ? option.value : 0 },
                    })
                  }
                  //crear un options que sea optionsEntities
                  options={optionEntities && optionEntities}
                  placeholder={
                    entitySelected === "Cliente"
                      ? "Seleccionar Cliente"
                      : entitySelected === "Vendedor"
                      ? "Selectcionar Vendedor"
                      : entitySelected === "Producto" && "Selectcionar Producto"
                  }
                  classNamePrefix="react-select"
                />
              </div>
            )} */}
          <button
            className={styles.buttonAplicar}
            onClick={handleAplicar}
            /* disabled={dateSelectedFrom == ""} */
          >
            Aplicar
          </button>
          {disabled && (
            <div className={styles.warningBox}>
              ⚠️{" "}
              <span className={styles.warningText}>
                Cambia fechas y reaplica.
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex" }}>
          <button
            className={styles.buttonAplicar}
            onClick={() => handleExportExcel(data, "Reportes")}
            disabled={reportes.length === 0 || disabled}
          >
            <SiMicrosoftexcel
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />{" "}
            Exportar
          </button>
          <div
            className={
              grafico === false
                ? styles.buttonTablaGraficos
                : styles.buttonTablaGraficosInactivo
            }
            onClick={() => setGrafico(false)}
            style={{ marginLeft: "5px" }}
          >
            <FaTableList
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            Tabla
          </div>

          <div
            className={
              grafico === true
                ? styles.buttonTablaGraficos
                : styles.buttonTablaGraficosInactivo
            }
            style={{ marginLeft: "5px" }}
            onClick={() => setGrafico(true)}
          >
            <BiBarChartAlt2
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            Gráfico
          </div>
        </div>
      </div>
      {/* Usar Strategy Pattern para renderizar visualización */}
      {grafico && (
        <div className={styles.container}>
          <h3 className={styles.title} style={{ display: "flex" }}>
            <div
              className={styles.botonMontoTotal}
              onClick={() => setContador(0)}
            >
              {"Montos por Fecha"}
            </div>
            <div
              className={styles.botonCantidad}
              onClick={() => setContador(1)}
            >
              {"Cantidad de Ventas por Fecha"}
            </div>
          </h3>
        </div>
      )}
      {visualizationStrategy.render(data)}
    </div>
  );
};

export default Reportes;
