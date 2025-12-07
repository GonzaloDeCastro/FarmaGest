/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSesionesAPI } from "../../redux/sesionesSlice";
import { formatString } from "../../functions/formatText";
import { useNavigate } from "react-router-dom";
import styles from "./Auditoria.module.css";

const Sesiones = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showBy, setShowBy] = useState(1);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const pageSize = 8;

  // Obtener sesiones con manejo seguro - los hooks deben estar fuera del try-catch
  const sesionesState = useSelector((state) => state?.sesiones);
  const sesiones = sesionesState || { sesionState: [], loading: false, error: null };

  useEffect(() => {
    try {
      dispatch(getSesionesAPI(page, pageSize, search));
    } catch (error) {
      console.error("Error al cargar sesiones:", error);
      setHasError(true);
    }
  }, [dispatch, page, pageSize, search]);

  // Definir columnas por defecto para evitar problemas cuando no hay datos
  const defaultColumns = [
    "correo_usuario",
    "nombre_completo",
    "navegador",
    "ip",
    "hora_logueo",
    "ultima_actividad",
    "hora_logout",
    "estado",
    "duracion",
  ];

  // Obtener las claves de los datos o usar las columnas por defecto
  let sesionesData = [];
  let keys = defaultColumns;
  
  try {
    sesionesData = Array.isArray(sesiones?.sesionState) ? sesiones.sesionState : [];
    
    if (sesionesData.length > 0 && sesionesData[0] && typeof sesionesData[0] === "object") {
      const keysFromData = Object.keys(sesionesData[0]).filter(
        (key) => key !== "sesion_id" && key !== "duracion_minutos"
      );
      keys = keysFromData.length > 0 ? keysFromData : defaultColumns;
    }
  } catch (error) {
    console.error("Error al procesar datos de sesiones:", error);
    keys = defaultColumns;
  }
  
  // Función para formatear nombres de columnas
  const getColumnLabel = (key) => {
    const labels = {
      correo_usuario: "Usuario",
      nombre_completo: "Nombre",
      navegador: "Navegador",
      ip: "Dirección IP",
      hora_logueo: "Hora de inicio",
      ultima_actividad: "Última actividad",
      hora_logout: "Hora de cierre",
      estado: "Estado",
      duracion: "Duración",
    };
    return labels[key] || formatString(key);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (showBy == 0) {
      navigate(`/auditoria`);
    }
  }, [showBy]);

  // Si hay un error crítico, mostrar mensaje
  if (hasError) {
    return (
      <div className="containerSelected">
        <div className="headerSelected">
          <h2>Error al cargar sesiones</h2>
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Hubo un error al cargar las sesiones. Por favor, recarga la página.</p>
        </div>
      </div>
    );
  }

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
          />{" "}
        </div>{" "}
        <select
          onChange={(e) => setShowBy(e.target.value)}
          className="buttonSelect"
          defaultValue={showBy}
        >
          <option value={0}>Auditoria</option>
          <option value={1}>Sesiones</option>
        </select>
      </div>
      <div className={styles.containerTableAndPagesSelected}>
        <table className={styles.headerTable}>
          <thead>
            <tr>
              {keys && keys.length > 0 ? (
                keys.map((column) => {
                  return <th key={column}>{getColumnLabel(column)}</th>;
                })
              ) : (
                <th>Sin columnas</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sesiones?.loading ? (
              <tr>
                <td colSpan={keys.length || 1} className="NoData">
                  Cargando...
                </td>
              </tr>
            ) : sesiones?.error ? (
              <tr>
                <td colSpan={keys.length || 1} className="NoData" style={{ color: "#ef4444" }}>
                  Error: {sesiones.error}
                </td>
              </tr>
            ) : sesionesData.length === 0 ? (
              <tr>
                <td colSpan={keys.length || 1} className="NoData">
                  Sin datos
                </td>
              </tr>
            ) : (
              sesionesData.map((sesion, index) => {
                if (!sesion || typeof sesion !== "object") return null;
                return (
                  <tr key={sesion.sesion_id || `sesion-${index}`}>
                    {keys.map((column) => {
                      try {
                        return (
                          <td
                            key={`${sesion.sesion_id || index}-${column}`}
                            style={{
                              textAlign: sesion[column] == null ? "center" : "left",
                            }}
                          >
                            {column === "hora_logueo" ||
                            column === "hora_logout" ||
                            column === "ultima_actividad"
                              ? sesion[column] == null
                                ? "-"
                                : (() => {
                                    try {
                                      return new Date(sesion[column])
                                        .toLocaleString("es-AR", {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        });
                                    } catch {
                                      return sesion[column] || "-";
                                    }
                                  })()
                              : column === "estado"
                              ? (
                                  <span
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      backgroundColor:
                                        sesion[column] === "Activa"
                                          ? "#10b981"
                                          : "#6b7280",
                                      color: "white",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {sesion[column] || "-"}
                                  </span>
                                )
                              : column === "ip"
                              ? sesion[column] || "-"
                              : sesion[column] != null
                              ? String(sesion[column])
                              : "-"}
                          </td>
                        );
                      } catch (error) {
                        console.error(`Error al renderizar columna ${column}:`, error);
                        return (
                          <td key={`${sesion.sesion_id || index}-${column}`}>-</td>
                        );
                      }
                    })}
                  </tr>
                );
              })
            )}
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
          style={{ marginLeft: "10px" }}
          disabled={
            !sesiones?.sesionState ||
            sesiones.sesionState.length < pageSize
          }
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Sesiones;
