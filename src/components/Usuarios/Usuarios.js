/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsuarioDataAPI,
  deleteUsuarioDataAPI,
  getRolesDataAPI,
  getObrasSocialesDataAPI,
  getCompaniasDataAPI,
} from "../../redux/usuariosSlice";
import { FaRegTrashCan } from "react-icons/fa6";

import Swal from "sweetalert2";
import UsuarioForm from "./UsuarioForm";
import EditUsuarioFormModal from "./EditUsuarioForm";

const Usuarios = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [roleID, setRoleID] = useState(0);
  const pageSize = 7;
  useEffect(() => {
    dispatch(getUsuarioDataAPI(page, pageSize, search, roleID));
    dispatch(getRolesDataAPI());
    dispatch(getObrasSocialesDataAPI());
    dispatch(getCompaniasDataAPI());
  }, [page, pageSize, search, roleID, dispatch]);
  const Usuarios = useSelector((state) => state?.usuario);
  const Roles = useSelector((state) => state && state?.usuario?.rolesState);
  const ObrasSociales = useSelector(
    (state) => state && state?.usuario?.obrasSocialesState
  );
  const Companias = useSelector(
    (state) => state && state?.usuario?.companiasState
  );

  const keys = Object?.keys(
    (Usuarios && Usuarios.initialState && Usuarios.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    Swal.fire({
      title: "Warning!",
      text: `¿Esta seguro que desea eliminar el usuario ${dato.Nombre} ${dato.Apellido}? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteUsuarioDataAPI(dato);
        dispatch(action);
      }
    });
  };

  const handleChange = (e) => {
    setRoleID(e.target.value);
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
        <div style={{ display: "flex" }}>
          <input
            className="inputSearch"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder=" &#xF002; Buscar..."
          />

          <select
            value={roleID}
            /*   className="form-select" */
            className="inputSearch"
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          >
            <option value="" className="default-option">
              Seleccionar rol
            </option>
            {Roles?.map((rol) => (
              <option
                key={rol.rol_id}
                value={rol.rol_id}
                data-user-role={rol.descripcion}
              >
                {rol.descripcion.charAt(0).toUpperCase() +
                  rol.descripcion.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex" }}>
          <UsuarioForm
            Roles={Roles}
            ObrasSociales={ObrasSociales}
            Companias={Companias}
          />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map((column) =>
                //quito columna usuario_id
                {
                  if (
                    column == "usuario_id" ||
                    column == "rol_id" ||
                    column == "cuit" ||
                    column == "codigo"
                  ) {
                    return null;
                  }

                  // Mostrar "compania" solo si roleID es igual a 2
                  if (column == "Compania" && roleID !== 2) {
                    return null;
                  }
                  if (column == "obra_social" && roleID !== 1) {
                    return null;
                  }

                  return (
                    <th key={column}>
                      {column == "obra_social" ? "Obra Social" : column}
                    </th>
                  );
                }
              )}

              <th style={{ width: "70px" }}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {Object?.keys(Usuarios)?.length == 0 ? (
              <div
                className="spinner-border"
                style={{ marginTop: "10%", width: "100px", height: "100px" }}
                role="status"
              />
            ) : Usuarios?.initialState?.length > 0 ? (
              Usuarios?.initialState?.map((dato) => (
                <tr key={dato.usuario_id}>
                  {keys
                    ?.filter((column) => {
                      // Excluir "usuario_id", "rol_id", y "cuit"
                      if (
                        column == "usuario_id" ||
                        column == "rol_id" ||
                        column == "cuit" ||
                        column == "codigo"
                      ) {
                        return false;
                      }
                      // Excluir "compania" si roleID no es igual a 2
                      if (column == "Compania" && roleID !== 2) {
                        return false;
                      }
                      if (column == "obra_social" && roleID !== 1) {
                        return false;
                      }
                      return true;
                    }) //filtro para que no aparezca la columna usuario_id
                    .map((column) => (
                      <td key={`${dato.usuario_id}-${column}`}>
                        {column == "Compania" && dato[column] == null
                          ? "-"
                          : dato[column]}
                      </td>
                    ))}

                  <td
                    style={{
                      flexWrap: "nowrap",
                    }}
                  >
                    <EditUsuarioFormModal
                      usuarioSelected={dato}
                      Roles={Roles}
                      ObrasSociales={ObrasSociales}
                      Companias={Companias}
                    />
                    <FaRegTrashCan
                      className="iconABM"
                      onClick={() => handleDelete(dato)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <div className="NoData">sin datos </div>
            )}
          </tbody>
        </table>
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page == 1}
            className="buttonPage"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            style={{ marginLeft: "10px" }}
            disabled={Usuarios?.initialState?.length < 6}
            className="buttonPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default Usuarios;
