/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditoriaProductosAPI } from "../../redux/auditoriaProductosSlice";
import { formatDate } from "../../functions/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./Auditoria.module.css";

const AuditoriaProductos = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showBy, setShowBy] = useState(0);
  const pageSize = 8;
  const navigate = useNavigate();
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
  useEffect(() => {
    if (showBy == 1) {
      navigate(`/sesiones`);
    }
  }, [showBy]);
  console.log("showBy auditoria", showBy);
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
        <select
          onChange={(e) => setShowBy(e.target.value)}
          className="buttonSelect"
          defaultValue={showBy}
        >
          <option value={0}>Auditoria</option>
          <option value={1}>Sesiones</option>
        </select>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className={styles.headerTable}>
          <thead>
            <tr>
              {keys.map((column) => {
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
              auditoriaProductos.initialState.map((auditoria, index) => (
                <tr key={index}>
                  {keys.map((column) => {
                    return (
                      <td key={`${auditoria.id}-${column}`}>
                        {column == "Fecha"
                          ? formatDate(auditoria[column])
                          : auditoria[column]}
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
