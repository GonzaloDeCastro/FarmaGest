import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProveedoresAPI,
  deleteProveedorAPI,
} from "../../redux/proveedoresSlice";
import { FaRegTrashCan } from "react-icons/fa6";

import Swal from "sweetalert2";
import ProveedorForm from "./ProveedorForm";
import EditProveedorForm from "./EditProveedorForm";

const Proveedores = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 7;

  useEffect(() => {
    dispatch(getProveedoresAPI(page, pageSize, search));
  }, [page, pageSize, search, dispatch]);

  const Proveedores = useSelector((state) => state && state?.proveedor);

  const keys = Object?.keys(
    (Proveedores && Proveedores.proveedores && Proveedores.proveedores[0]) || {}
  );

  const handleDelete = (dato) => {
    Swal.fire({
      title: "Warning!",
      text: `¿Está seguro que desea eliminar el proveedor ${dato.razon_social}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteProveedorAPI(dato.id);
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
          <ProveedorForm />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map(
                (column) =>
                  //quito columna id
                  column !== "proveedor_id" && (
                    <th key={column}>
                      {column == "razon_social" ? "Razon Social" : column}
                    </th>
                  )
              )}
              <th style={{ width: "70px" }}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {Object?.keys(Proveedores)?.length === 0 ? (
              <div
                className="spinner-border"
                style={{ marginTop: "10%", width: "100px", height: "100px" }}
                role="status"
              />
            ) : Proveedores?.proveedores?.length > 0 ? (
              Proveedores?.proveedores?.map((dato) => (
                <tr key={dato.id}>
                  {keys
                    ?.filter((column) => column !== "proveedor_id") //filtro para que no aparezca la columna id
                    .map((column) => (
                      <td key={`${dato.id}-${column}`}>{dato[column]}</td>
                    ))}
                  <td
                    style={{
                      flexWrap: "nowrap",
                    }}
                  >
                    <EditProveedorForm proveedorSelected={dato} />
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
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="buttonPage"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            style={{ marginLeft: "10px" }}
            disabled={Proveedores?.proveedores?.length < pageSize}
            className="buttonPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Proveedores;
