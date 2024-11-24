import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Reportes.module.css";
import { Select } from "react-select-virtualized";
import { getClientesAPI } from "../../redux/clientesSlice";
import { getProductosAPI } from "../../redux/productosSlice";
import { getUsuariosAPI } from "../../redux/usuariosSlice";
import { getReportesAPI } from "../../redux/reportesSlice";
import { FaTableList } from "react-icons/fa6";
import { BiBarChartAlt2 } from "react-icons/bi";

const Reportes = () => {
  const dispatch = useDispatch();
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged.sesion;
  const reportes = useSelector((state) => state.reporte.initialState || []);
  const [clienteProductoVendedor, setClienteProductoVendedor] = useState("");
  const [grafico, setGrafico] = useState(false);
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const year = lastWeek.getFullYear();
  const month = String(lastWeek.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
  const day = String(lastWeek.getDate()).padStart(2, "0"); // Día del mes

  const lastWeekFormatted = `${year}-${month}-${day}`;
  const [dateSelectedFrom, setDateSelectedFrom] = useState(lastWeekFormatted);
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
  const productos = useSelector(
    (state) => (state && state.producto && state.producto) || []
  );

  const usuarios = useSelector(
    (state) => (state && state?.usuario && state?.usuario) || []
  );

  const handleSelectDateFrom = (e) => {
    setDateSelectedFrom(e.target.value);
  };

  const handleSelectDateTo = (e) => {
    setDateSelectedTo(e.target.value);
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
      let optionsProductos =
        productos &&
        productos?.initialState?.map((producto) => ({
          value: producto.producto_id,
          label: `${producto.Nombre}`,
        }));
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
    dispatch(
      getReportesAPI(
        dateSelectedFrom,
        dateSelectedTo,
        entitySelected,
        clienteProductoVendedor
      )
    );
  };

  const data = reportes
    .map((item) => ({
      fecha: new Date(item.fecha).toISOString().split("T")[0], // YYYY-MM-DD
      monto: parseFloat(item.monto_total),
    }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Ordenar por fecha de menor a mayor

  // Encontrar el valor máximo para escalar las barras
  const maxMonto = Math.max(...data.map((item) => item.monto));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  return (
    <div className="containerSelected">
      <div className={styles.containerHeader}>
        <div className={styles.header}>
          <div className={styles.containerDate}>
            Fecha Inicio{" "}
            <input
              type="date"
              className={styles.formSelectDate}
              style={{ border: "none" }}
              onChange={handleSelectDateFrom}
              value={dateSelectedFrom}
            />
          </div>
          <div className={styles.containerDate}>
            Fecha Fin{" "}
            <input
              type="date"
              className={styles.formSelectDate}
              style={{ border: "none" }}
              onChange={handleSelectDateTo}
              value={dateSelectedTo}
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
                      ? "Selectcionar Cliente"
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
            disabled={dateSelectedFrom == ""}
          >
            Aplicar
          </button>
        </div>
        <div style={{ display: "flex" }}>
          <div
            className={
              grafico === false
                ? styles.buttonTablaGraficos
                : styles.buttonTablaGraficosInactivo
            }
            onClick={() => setGrafico(false)}
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
            Grafico
          </div>
        </div>
      </div>
      {grafico ? (
        <div className={styles.container}>
          <h3 className={styles.title}>Montos por Fecha</h3>
          <div className={styles.chartContainer}>
            {/* Renderizar líneas guía en el eje Y */}
            <div className={styles.yAxis}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className={styles.yAxisLine}>
                  <div className={styles.yGuideLine}></div>{" "}
                  {/* Solo líneas guía */}
                </div>
              ))}
            </div>

            {/* Renderizar barras */}
            <div className={styles.bars}>
              {data.map((item, index) => (
                <div key={index} className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(item.monto / maxMonto) * 100}%`,
                    }}
                  >
                    <span className={styles.barLabel}>
                      {item.monto.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.label}>{item.fecha}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.headerTable}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte, index) => (
                <tr key={index}>
                  <td>{formatDate(reporte.fecha)}</td>
                  <td>${reporte.monto_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reportes;
