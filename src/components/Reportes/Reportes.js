import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Reportes.module.css";
import { Select } from "react-select-virtualized";
import { getClientesAPI } from "../../redux/clientesSlice";
import { getProductosAPI } from "../../redux/productosSlice";
import { getUsuariosAPI } from "../../redux/usuariosSlice";
import { getReportesAPI } from "../../redux/reportesSlice";
const Reportes = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged.sesion;
  const reportes = useSelector((state) => state.reporte.initialState || []);
  const [clienteProductoVendedor, setClienteProductoVendedor] = useState("");
  const [dateSelectedFrom, setDateSelectedFrom] = useState(
    "" /* getCurrentDateFormatted() */
  );
  const [dateSelectedTo, setDateSelectedTo] = useState(
    "" /* getCurrentDateFormatted() */
  );

  const [entitySelected, setSelectEntity] = useState("");
  const [optionEntities, setSelectOptionEntities] = useState("");
  useEffect(() => {
    dispatch(getReportesAPI(page, pageSize, ""));
  }, [dispatch, page]);

  const clientes = useSelector(
    (state) => (state && state.cliente && state.cliente) || []
  );
  const productos = useSelector(
    (state) => (state && state.producto && state.producto) || []
  );

  const usuarios = useSelector(
    (state) => (state && state?.usuario && state?.usuario) || []
  );
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

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
    console.log("dateSelectedFrom", dateSelectedFrom);
    console.log("dateSelectedTo", dateSelectedTo);
    console.log("entity ", entitySelected);
    console.log("clienteProductoVendedor ", clienteProductoVendedor);
    //esto lo sigo mañana
    dispatch(
      getReportesAPI(
        dateSelectedFrom,
        dateSelectedTo,
        entitySelected,
        clienteProductoVendedor
      )
    );
  };
  return (
    <div className="containerSelected">
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
        </div>
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
          )}
        <button
          className={styles.buttonAplicar}
          onClick={handleAplicar}
          disabled={dateSelectedFrom == ""}
        >
          Aplicar
        </button>
      </div>

      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {/* Aquí mapeamos las claves ajustadas, incluyendo las combinaciones de nombres */}
              <th>Fecha</th>
              <th>Número Factura</th>
              <th>Cliente</th>
              <th>Usuario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((venta) => (
              <tr key={venta.venta_id}>
                <td>{formatDate(venta.fecha_hora)}</td>
                <td>{venta.numero_factura}</td>
                <td>{`${venta.cliente_nombre} ${venta.cliente_apellido}`}</td>
                <td>{`${venta.usuario_nombre} ${venta.usuario_apellido}`}</td>
                <td>${venta.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="buttonPage"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="buttonPage"
          style={{ marginLeft: "10px" }}
          disabled={reportes && reportes.length < pageSize}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Reportes;
