/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsuariosAPI,
  deleteUsuarioAPI,
  getRolesAPI,
} from "../../redux/usuariosSlice";
import { FaRegTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import UsuarioForm from "./UsuarioForm";
import EditUsuarioFormModal from "./EditUsuarioForm";
import ResetPassword from "./ResetPassword";

const Usuarios = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [roleID, setRoleID] = useState(0);
  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const sesion = logged?.sesion?.sesion_id;
  const Usuarios = useSelector(
    (state) => state && state?.usuario && state?.usuario
  );

  const Roles = useSelector((state) => state && state?.usuario?.rolesState);

  useEffect(() => {
    dispatch(getUsuariosAPI(page, pageSize, search, roleID, sesion));
    dispatch(getRolesAPI());
  }, [page, pageSize, search, roleID, dispatch]);

  const keys = Object?.keys(
    (Usuarios && Usuarios.initialState && Usuarios.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    Swal.fire({
      title: "Advertencia!",
      text: `¿Esta seguro que desea eliminar el usuario ${dato.Nombre} ${dato.Apellido}? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteUsuarioAPI(dato);
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
                data-user-role={rol.rol}
              >
                {rol.rol.charAt(0).toUpperCase() + rol.rol.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex" }}>
          <UsuarioForm Roles={Roles} />
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
                    column == "compania_id" ||
                    column == "codigo"
                  ) {
                    return null;
                  }

                  // Mostrar "compania" solo si roleID es igual a 2
                  if (column == "Compania" && roleID != 2) {
                    return null;
                  }
                  if (column == "obra_social" && roleID != 1) {
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
            ) : Usuarios.initialState && Usuarios?.initialState?.length > 0 ? (
              Usuarios?.initialState?.map((dato) => (
                <tr key={dato.usuario_id}>
                  {keys
                    ?.filter((column) => {
                      // Excluir "usuario_id" y "rol_id"
                      if (column == "usuario_id" || column == "rol_id") {
                        return false;
                      }

                      return true;
                    }) //filtro para que no aparezca la columna usuario_id
                    .map((column) => (
                      <td key={`${dato.usuario_id}-${column}`}>
                        {column == "Estado" && dato[column] == 1
                          ? "Activo"
                          : column == "Estado" && dato[column] == 0
                          ? "Inactivo"
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
                    />
                    <ResetPassword userSelected={dato} />
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
      </div>
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page == 1}
          className="buttonPage"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          style={{ marginLeft: "10px" }}
          disabled={Usuarios?.initialState?.length < 6}
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
export default Usuarios;
