import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getObrasSocialesAPI,
  deleteObraSocialAPI,
} from "../../redux/obrasSocialesSlice";
import { FaRegTrashCan } from "react-icons/fa6";

import Swal from "sweetalert2";
import ObraSocialForm from "./ObraSocialForm";
import EditObraSocialForm from "./EditObraSocialForm";

const ObrasSociales = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged?.sesion?.sesion_id;
  const pageSize = 8;

  useEffect(() => {
    dispatch(getObrasSocialesAPI(page, pageSize, search, sesion));
  }, [page, pageSize, search, dispatch]);

  const ObrasSociales = useSelector((state) => state && state?.obrasocial);

  const keys = Object?.keys(
    (ObrasSociales &&
      ObrasSociales.initialState &&
      ObrasSociales.initialState[0]) ||
      {}
  );

  const handleDelete = (dato) => {
    Swal.fire({
      title: "Advertencia!",
      text: `¿Está seguro que desea eliminar la obra social ${dato.obra_social}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteObraSocialAPI(dato.obra_social_id);
        dispatch(action);
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div>
          <input
            className="inputSearch"
            type="text"
            onChange={handleSearchChange}
            value={search}
            placeholder=" &#xF002; Buscar..."
          />
        </div>
        <div style={{ display: "flex" }}>
          <ObraSocialForm />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map(
                (column) =>
                  //quito columna id
                  column !== "obra_social_id" && (
                    <th key={column}>
                      {column == "obra_social" ? "Obra Social" : column}
                    </th>
                  )
              )}
              <th style={{ width: "70px" }}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {Object?.keys(ObrasSociales)?.length === 0 ? (
              <div
                className="spinner-border"
                style={{ marginTop: "10%", width: "100px", height: "100px" }}
                role="status"
              />
            ) : ObrasSociales?.initialState?.length > 0 ? (
              ObrasSociales?.initialState?.map((dato) => (
                <tr key={dato.obra_social_id}>
                  {keys
                    ?.filter((column) => column !== "obra_social_id") //filtro para que no aparezca la columna id
                    .map((column) => (
                      <td key={`${dato.obra_social_id}-${column}`}>
                        {dato[column]}
                      </td>
                    ))}
                  <td
                    style={{
                      flexWrap: "nowrap",
                    }}
                  >
                    <EditObraSocialForm obraSocialSelected={dato} />
                    <FaRegTrashCan
                      className="iconABM"
                      onClick={() => handleDelete(dato)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <div className="NoData">sin datos</div>
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
          disabled={ObrasSociales?.initialState?.length < pageSize}
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ObrasSociales;
