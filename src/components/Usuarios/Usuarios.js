import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsuarioDataAPI,
  deleteUsuarioDataAPI,
} from "../../redux/usuariosSlice";
import { FaRegTrashCan } from "react-icons/fa6";

import Swal from "sweetalert2";
import UsuarioForm from "./UsuarioForm";
import EditUsuarioFormModal from "./EditUsuarioForm";

const Usuarios = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsuarioDataAPI());
    dispatch(getUsuarioDataAPI());
  }, [dispatch]);

  const Usuarios = useSelector((state) => state?.usuario);
  console.log("Usuarios ", Usuarios);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredUsuarios = Usuarios?.initialState?.filter((usuario) => {
    const Usuarios =
      `${usuario.Nombre} ${usuario.Apellido}  ${usuario.Email}`.toLowerCase();
    return Usuarios.includes(searchText.toLowerCase());
  });

  console.log("filteredUsuarios ", filteredUsuarios);
  const keys = Object?.keys(
    (Usuarios && Usuarios.initialState && Usuarios.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    Swal.fire({
      title: "Warning!",
      text: `¿Esta seguro que desea eliminar el usuario ${dato.Usuario}? `,
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
  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div>
          <input
            className="inputSearch"
            type="text"
            onChange={handleSearch}
            value={searchText}
            placeholder=" &#xF002; Buscar..."
          />
        </div>
        <div style={{ display: "flex" }}>
          <UsuarioForm Users={Usuarios} />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map(
                (column) =>
                  //quito columna usuario_id
                  column !== "usuario_id" && <th key={column}>{column}</th>
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
              filteredUsuarios?.map((dato) => (
                <tr key={dato.usuario_id}>
                  {keys
                    ?.filter((column) => column !== "usuario_id") //filtro para que no aparezca la columna usuario_id
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
