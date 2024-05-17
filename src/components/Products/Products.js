import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDataAPI,
  deleteProductDataAPI,
} from "../../redux/productsSlice";
import { FaRegTrashCan } from "react-icons/fa6";

import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import EditProductFormModal from "./EditProductForm";

const Products = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductDataAPI());
  }, [dispatch]);

  const Products = useSelector((state) => state?.product);

  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredProducts = Products?.initialState?.filter((product) => {
    const Products = `${product.Producto} ${product.Precio}`.toLowerCase();
    return Products.includes(searchText.toLowerCase());
  });

  console.log("filteredProducts ", filteredProducts);
  const keys = Object?.keys(
    (Products && Products.initialState && Products.initialState[0]) || {}
  );
  const handleDelete = (dato) => {
    Swal.fire({
      title: "Warning!",
      text: `¿Esta seguro que desea eliminar el producto ${dato.Producto}? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const action = deleteProductDataAPI(dato);
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
          <ProductForm />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys.map(
                (column) =>
                  //quito columna producto_id
                  column !== "producto_id" && <th key={column}>{column}</th>
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
            ) : filteredProducts?.length > 0 ? (
              filteredProducts?.map((dato) => (
                <tr key={dato.producto_id}>
                  {keys
                    ?.filter((column) => column !== "producto_id") //filtro para que no aparezca la columna producto_id
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
                    <EditProductFormModal productSelected={dato} />
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
export default Products;
