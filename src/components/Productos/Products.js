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

  useEffect(() => {
    dispatch(getProductosAPI(page, pageSize, search));
    dispatch(getCategoriasAPI());
  }, [page, pageSize, search, dispatch]);

  const Products = useSelector((state) => state && state?.producto);
  const Categorias = useSelector(
    (state) => state && state?.producto && state?.producto?.categoriasState
  );

  const keys = Object?.keys(
    (Products && Products.initialState && Products.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    Swal.fire({
      title: "Advertencia!",
      text: `¿Esta seguro que desea eliminar el producto ${dato.Producto}? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteProductoAPI(dato);
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
          <ProductForm Categorias={Categorias} />
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
              <div
                className="spinner-border"
                style={{ marginTop: "10%", width: "100px", height: "100px" }}
                role="status"
              />
            ) : Products?.initialState?.length > 0 ? (
              Products?.initialState?.map((dato) => (
                <tr key={dato.producto_id}>
                  {keys
                    ?.filter(
                      (column) =>
                        column !== "producto_id" && column !== "categoria_id"
                    ) //filtro para que no aparezca la columna producto_id
                    .map((column) => (
                      <td key={`${dato.producto_id}-${column}`}>
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
