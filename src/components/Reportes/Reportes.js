import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVentasAPI } from "../../redux/ventasSlice";
import styles from "./Reportes.module.css";
import { MdCheckCircleOutline } from "react-icons/md";

import { Select } from "react-select-virtualized";
import { getClientesAPI } from "../../redux/clientesSlice";

const Reportes = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged.sesion;
  const ventas = useSelector((state) => state.venta.initialState || []);
  const [dateSelectedFrom, setDateSelectedFrom] = useState(
    "" /* getCurrentDateFormatted() */
  );
  const [dateSelectedTo, setDateSelectedTo] = useState(
    "" /* getCurrentDateFormatted() */
  );
  const [cliente, setCliente] = useState(0);
  const [entitySelected, setSelectEntity] = useState("");
  useEffect(() => {
    dispatch(getVentasAPI(page, pageSize, search));
  }, [dispatch, page, search]);

  const clientes = useSelector(
    (state) => state && state.cliente && state.cliente
  );
  useEffect(() => {
    dispatch(getClientesAPI());
  }, [dispatch]);

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

  const handleCliente = (event) => {
    setCliente(event.target.value);
  };
  const handleSelectDateFrom = (e) => {
    setDateSelectedFrom(e.target.value);
  };

  const handleSelectDateTo = (e) => {
    setDateSelectedTo(e.target.value);
  };

  const handleChangeEntity = (e) => {
    setSelectEntity(e.target.value);
  };

  let optionsClientes =
    clientes &&
    clientes?.initialState?.map((cliente) => ({
      value: cliente.cliente_id,
      label: `${cliente.Apellido} ${cliente.Nombre}`,
    }));
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
        {optionsClientes &&
          optionsClientes.length > 0 &&
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
                options={optionsClientes && optionsClientes}
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
        <div className={styles.buttonAplicar}>Aplicar</div>
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
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.venta_id}>
                <td>{formatDate(venta.fecha_hora)}</td>
                <td>{venta.numero_factura}</td>
                <td>{`${venta.cliente_nombre} ${venta.cliente_apellido}`}</td>
                <td>{`${venta.usuario_nombre} ${venta.usuario_apellido}`}</td>
                <td>${venta.total}</td>
                <td>
                  <div style={{ display: "flex" }}></div>
                </td>
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
          disabled={ventas && ventas.length < pageSize}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Reportes;
