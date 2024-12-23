import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { getVentasAPI } from "../../redux/ventasSlice";
import { MdReceiptLong } from "react-icons/md";
import VentaFormModal from "./VentaForm";
import FacturaDetalle from "./FacturaDetalle";

const Ventas = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged.sesion;
  const ventas = useSelector((state) => state.venta.initialState || []);

  useEffect(() => {
    dispatch(getVentasAPI(page, pageSize, search));
  }, [dispatch, page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

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

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <input
          className="inputSearch"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar ventas..."
        />
        <div style={{ display: "flex" }}>
          <VentaFormModal usuarioId={sesion.usuario_id} />
        </div>
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
                  {/* <EditVentaForm venta={venta} /> */}
                  <div style={{ display: "flex" }}>
                    <FacturaDetalle ventaId={venta.venta_id} />
                    <MdReceiptLong
                      data-tooltip-id="my-tooltip-NC"
                      data-tooltip-content="Nota de Crédito"
                      className="iconABMDisabled"
                    />
                    <Tooltip id="my-tooltip-NC"> Nota de crédito</Tooltip>
                  </div>
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

export default Ventas;
