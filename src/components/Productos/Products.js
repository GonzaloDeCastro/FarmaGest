import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductosAPI,
  deleteProductoAPI,
  getCategoriasAPI,
} from "../../redux/productosSlice";
import { FaRegTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import EditProductFormModal from "./EditProductForm";

const Products = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const usuarioId = logged?.sesion?.usuario_id;
  const sesion = logged?.sesion?.sesion_id;

  useEffect(() => {
    dispatch(getProductosAPI(page, pageSize, search, sesion));
    dispatch(getCategoriasAPI());
  }, [page, pageSize, search, dispatch]);

  const Products = useSelector((state) => state && state?.producto);
  const Categorias = useSelector(
    (state) => state && state?.producto && state?.producto?.categoriasState
  ) || [];

  // Debug: verificar categorías (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Categorías en Redux:', Categorias);
    console.log('🔍 Tipo:', typeof Categorias, 'Es array?', Array.isArray(Categorias));
  }

  const keys = Object?.keys(
    (Products && Products.initialState && Products.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    const datoWithUserId = { ...dato, usuario_id: usuarioId };
    Swal.fire({
      title: "Advertencia!",
      html: `¿Esta seguro que desea eliminar el producto <b>${dato.Nombre}</b> ? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteProductoAPI(datoWithUserId);
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
            id="search-productos"
            name="search-productos"
            className="inputSearch"
            type="text"
            onChange={handleSearchChange}
            value={search}
            placeholder=" &#xF002; Buscar..."
          />
        </div>
        <div style={{ display: "flex" }}>
          <ProductForm Categorias={Categorias} usuarioId={usuarioId} />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map(
                (column) =>
                  //quito columna producto_id
                  column !== "producto_id" &&
                  column !== "categoria_id" && <th key={column}>{column}</th>
              )}

              <th style={{ width: "70px" }}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {Object?.keys(Products)?.length === 0 ? (
              <tr>
                <td colSpan={keys?.length || 1} style={{ textAlign: "center", padding: "40px" }}>
                  <div
                    className="spinner-border"
                    style={{ marginTop: "10%", width: "100px", height: "100px" }}
                    role="status"
                  />
                </td>
              </tr>
            ) : Products?.initialState?.length > 0 ? (
              Products?.initialState?.map((dato) => (
                <tr
                  key={dato.producto_id}
                  style={{
                    backgroundColor: dato.Stock <= 0 && "#f8d7da",
                  }}
                >
                  {keys
                    ?.filter(
                      (column) =>
                        column !== "producto_id" && column !== "categoria_id"
                    ) //filtro para que no aparezca la columna producto_id
                    .map((column) => (
                      <td
                        style={{
                          color:
                            column === "Stock" && dato[column] <= 0 && "red",
                          fontWeight: column === "Stock" && "bold",
                        }}
                        key={`${dato.producto_id}-${column}`}
                      >
                        {dato[column]}
                      </td>
                    ))}

                  <td
                    style={{
                      flexWrap: "nowrap",
                    }}
                  >
                    <EditProductFormModal
                      productSelected={dato}
                      Categorias={Categorias}
                      usuarioId={usuarioId}
                    />
                    <FaRegTrashCan
                      className="iconABM"
                      onClick={() => handleDelete(dato)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={keys?.length || 1} className="NoData" style={{ textAlign: "center", padding: "20px" }}>
                  sin datos
                </td>
              </tr>
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
          disabled={Products?.initialState?.length < 6}
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
export default Products;
