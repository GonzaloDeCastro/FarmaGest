/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditoriaProductosAPI } from "../../redux/auditoriaProductosSlice";
import { getAuditoriaClientesAPI } from "../../redux/auditoriaClientesSlice";
import { formatDate } from "../../functions/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./Auditoria.module.css";

const Auditoria = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📌 Estados del componente
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showBy, setShowBy] = useState(0);
  const [auditoria, setAuditoria] = useState(0);
  const [entidad, setEntidad] = useState([]); // Inicializamos vacío

  const pageSize = 8;

  // 📌 Obtener datos de Redux
  const auditoriaProductos = useSelector((state) => state.auditoriaProductos);
  const auditoriaClientes = useSelector((state) => state.auditoriaClientes);

  // 📌 Efecto para cargar la auditoría
  useEffect(() => {
    const fetchAuditoria = async () => {
      if (auditoria == 0) {
        await dispatch(getAuditoriaProductosAPI(page, pageSize, search));
      } else if (auditoria == 1) {
        await dispatch(getAuditoriaClientesAPI(page, pageSize, search));
      }
    };

    fetchAuditoria();
  }, [dispatch, page, pageSize, search, auditoria]);

  // 📌 Efecto para actualizar `entidad` cuando los datos cambian
  useEffect(() => {
    if (auditoria == 0) {
      setEntidad(auditoriaProductos.initialState || []);
    } else if (auditoria == 1) {
      setEntidad(auditoriaClientes.initialState || []);
    }
  }, [auditoria, auditoriaProductos, auditoriaClientes]);

  // 📌 Obtener las claves de la entidad (si existen datos)
  const keys = entidad.length > 0 ? Object.keys(entidad[0]) : [];

  // 📌 Manejo de eventos
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    if (showBy == 1) navigate(`/sesiones`);
  }, [showBy]);

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div style={{ display: "flex" }}>
          <input
            className="inputSearch"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar..."
          />
        </div>
        <div style={{ display: "flex" }}>
          <select
            onChange={(e) => setAuditoria(Number(e.target.value))}
            className="buttonSelect"
            value={auditoria}
            style={{ marginRight: "10px" }}
          >
            <option value={0}>Tabla Productos</option>
            <option value={1}>Tabla Clientes</option>
          </select>
          <select
            onChange={(e) => setShowBy(Number(e.target.value))}
            className="buttonSelect"
            value={showBy}
          >
            <option value={0}>Auditoría</option>
            <option value={1}>Sesiones</option>
          </select>
        </div>
      </div>

      {/* 📌 Tabla de auditoría */}
      <div className={styles.containerTableAndPagesSelected}>
        <table className={styles.headerTable}>
          <thead>
            <tr>
              {keys.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entidad.length === 0 ? (
              <tr>
                <td colSpan={keys.length + 1} className="NoData">
                  Sin datos
                </td>
              </tr>
            ) : (
              entidad.map((auditoria, index) => (
                <tr key={index}>
                  {keys.map((column) => (
                    <td
                      style={{
                        width:
                          column == "Fecha" || column == "Accion"
                            ? "10%"
                            : (column == "Producto" || column == "Nombre") &&
                              "15%",
                      }}
                      key={`${auditoria.id}-${column}`}
                    >
                      {column == "Fecha"
                        ? formatDate(auditoria[column])
                        : auditoria[column]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📌 Paginación */}
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
          style={{ marginLeft: "10px" }}
          disabled={entidad.length < pageSize}
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Auditoria;
