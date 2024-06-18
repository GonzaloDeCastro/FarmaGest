import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsuarioDataAPI,
  deleteUsuarioDataAPI,
  getRolesDataAPI,
} from "../../redux/usuariosSlice";
import { FaRegTrashCan } from "react-icons/fa6";

import Swal from "sweetalert2";
import UsuarioForm from "./UsuarioForm";
import EditUsuarioFormModal from "./EditUsuarioForm";

const Usuarios = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsuarioDataAPI());
    dispatch(getRolesDataAPI());
  }, [dispatch]);
  const [roleID, setRoleID] = useState(0);
  const [roleDesc, setRoleDesc] = useState("");
  const Usuarios = useSelector((state) => state?.usuario);
  const Roles = useSelector((state) => state && state?.usuario?.rolesState);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredUsuarios = Usuarios?.initialState?.filter((usuario) => {
    const Usuarios =
      `${usuario.Nombre} ${usuario.Apellido}  ${usuario.Email}`.toLowerCase();
    return Usuarios.includes(searchText.toLowerCase());
  });

  const keys = Object?.keys(
    (Usuarios && Usuarios.initialState && Usuarios.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    console.log("dato ", dato);
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
    const selectedCompaniaDesc =
      e.target.selectedOptions[0].getAttribute("data-user-role");
    setRoleDesc(selectedCompaniaDesc);
  };
  console.log("rol ", roleID);
  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div style={{ display: "flex" }}>
          <input
            className="inputSearch"
            type="text"
            onChange={handleSearch}
            value={searchText}
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
          <UsuarioForm Users={Usuarios} />
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
                    column === "usuario_id" ||
                    column === "rol_id" ||
                    column === "cuit" ||
                    column === "codigo"
                  ) {
                    return null;
                  }

                  // Mostrar "compania" solo si roleID es igual a 2
                  if (column === "Compania" && roleID != 2) {
                    return null;
                  }
                  if (column === "obra_social" && roleID != 1) {
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
            {Object?.keys(Usuarios)?.length === 0 ? (
              <div
                className="spinner-border"
                style={{ marginTop: "10%", width: "100px", height: "100px" }}
                role="status"
              />
            ) : filteredUsuarios?.length > 0 ? (
              filteredUsuarios
                ?.filter((user) => roleID == 0 || user.rol_id == roleID)
                .map((dato) => (
                  <tr key={dato.usuario_id}>
                    {keys
                      ?.filter((column) => {
                        // Excluir "usuario_id", "rol_id", y "cuit"
                        if (
                          column === "usuario_id" ||
                          column === "rol_id" ||
                          column === "cuit" ||
                          column === "codigo"
                        ) {
                          return false;
                        }
                        // Excluir "compania" si roleID no es igual a 2
                        if (column === "Compania" && roleID != 2) {
                          return false;
                        }
                        if (column === "obra_social" && roleID != 1) {
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
                        Users={Usuarios}
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
      </div>
    </div>
  );
};
export default Usuarios;
