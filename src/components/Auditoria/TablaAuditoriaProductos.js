/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditoriaProductosAPI } from "../../redux/auditoriaProductosSlice";

const AuditoriaProductos = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 8;

  const auditoriaProductos = useSelector(
    (state) => state && state.auditoriaProductos && state.auditoriaProductos
  );

  useEffect(() => {
    dispatch(getAuditoriaProductosAPI(page, pageSize, search));
  }, [dispatch, page, pageSize, search]);

  const keys = Object.keys(
    (auditoriaProductos &&
      auditoriaProductos.initialState &&
      auditoriaProductos.initialState[0]) ||
      {}
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div style={{ display: "flex" }}>
          <input
            className="inputSearch"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="&#xF002; Buscar..."
          />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map((column) => {
                if (
                  column === "cliente_id" ||
                  column === "obra_social_id" ||
                  column === "ciudad_id"
                ) {
                  return null;
                }
                return (
                  <th key={column}>
                    {column == "obra_social" ? "Obra Social" : column}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {auditoriaProductos &&
            auditoriaProductos.initialState &&
            auditoriaProductos.initialState.length === 0 ? (
              <tr>
                <td colSpan={keys.length + 1} className="NoData">
                  Sin datos
                </td>
              </tr>
            ) : (
              auditoriaProductos &&
              auditoriaProductos.initialState &&
              auditoriaProductos.initialState.map((cliente) => (
                <tr key={cliente.cliente_id}>
                  {keys.map((column) => {
                    if (
                      column === "cliente_id" ||
                      column === "obra_social_id" ||
                      column === "ciudad_id"
                    ) {
                      return null;
                    }
                    return (
                      <td key={`${cliente.cliente_id}-${column}`}>
                        {cliente[column]}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div /* style={{ border: "solid 1px" }} */>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="buttonPage"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          style={{ marginLeft: "10px" }}
          disabled={
            auditoriaProductos &&
            auditoriaProductos.initialState &&
            auditoriaProductos.initialState.length < pageSize
          }
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AuditoriaProductos;
