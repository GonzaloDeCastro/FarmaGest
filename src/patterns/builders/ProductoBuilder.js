/**
 * Builder Pattern para construir objetos de Producto
 * Permite construir objetos complejos paso a paso con validaciones
 */
class ProductoBuilder {
  constructor() {
    this.producto = {};
  }

  setNombre(nombre) {
    if (!nombre || nombre.trim() === "") {
      throw new Error("Nombre es requerido");
    }
    this.producto.nombre = nombre.trim();
    return this;
  }

  setCodigo(codigo) {
    if (!codigo || codigo.trim() === "") {
      throw new Error("Código es requerido");
    }
    this.producto.codigo = codigo.trim();
    return this;
  }

  setMarca(marca) {
    if (!marca || marca.trim() === "") {
      throw new Error("Marca es requerida");
    }
    this.producto.marca = marca.trim();
    return this;
  }

  setCategoria(categoriaId, categoriaDesc) {
    this.producto.categoria_id = categoriaId === 0 || categoriaId === "" ? null : parseInt(categoriaId);
    this.producto.Categoria = categoriaDesc || "";
    return this;
  }

  setPrecio(precio) {
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      throw new Error("Precio debe ser un número mayor a 0");
    }
    this.producto.precio = precioNum;
    return this;
  }

  setStock(stock) {
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      throw new Error("Stock debe ser un número mayor o igual a 0");
    }
    this.producto.stock = stockNum;
    return this;
  }

  setUsuario(usuarioId) {
    if (!usuarioId) {
      throw new Error("Usuario es requerido");
    }
    this.producto.usuario_id = usuarioId;
    return this;
  }

  build() {
    // Validaciones finales
    if (!this.producto.nombre) {
      throw new Error("Nombre es requerido");
    }
    if (!this.producto.codigo) {
      throw new Error("Código es requerido");
    }
    if (!this.producto.marca) {
      throw new Error("Marca es requerida");
    }
    if (!this.producto.precio || this.producto.precio <= 0) {
      throw new Error("Precio debe ser mayor a 0");
    }
    if (this.producto.stock === undefined || this.producto.stock < 0) {
      throw new Error("Stock debe ser mayor o igual a 0");
    }

    return { ...this.producto };
  }
}

export default ProductoBuilder;






