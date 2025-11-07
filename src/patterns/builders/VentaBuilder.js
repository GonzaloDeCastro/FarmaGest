/**
 * Builder Pattern para construir objetos de Venta
 * Permite construir objetos complejos paso a paso con validaciones
 */
class VentaBuilder {
  constructor() {
    this.venta = {
      itemsAgregados: [],
      totalConDescuento: 0,
      totalSinDescuento: 0,
      descuento: 0,
      fecha_hora: new Date().toISOString().slice(0, 16),
    };
  }

  setCliente(clienteId) {
    if (!clienteId || clienteId === 0) {
      throw new Error("Cliente es requerido");
    }
    this.venta.cliente_id = clienteId;
    return this;
  }

  setItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Debe agregar al menos un item");
    }
    this.venta.itemsAgregados = items;
    return this;
  }

  addItem(item) {
    if (!item) {
      throw new Error("Item inválido");
    }
    this.venta.itemsAgregados.push(item);
    return this;
  }

  setObraSocial(obraSocial) {
    if (obraSocial) {
      const descuentoValor =
        obraSocial.Descuento ?? obraSocial.descuento ?? null;
      if (descuentoValor !== null && descuentoValor !== undefined) {
        this.venta.descuento = parseFloat(descuentoValor) * 100;
      }
    }
    return this;
  }

  calculateTotal() {
    const total = this.venta.itemsAgregados.reduce(
      (sum, item) => sum + parseFloat(item.total || 0),
      0
    );
    this.venta.totalSinDescuento = total.toFixed(2);
    return this;
  }

  applyDescuento() {
    const descuento = this.venta.descuento / 100;
    const totalConDescuento = (
      parseFloat(this.venta.totalSinDescuento) * (1 - descuento)
    ).toFixed(2);
    this.venta.totalConDescuento = totalConDescuento;
    return this;
  }

  setUsuario(usuarioId) {
    if (!usuarioId) {
      throw new Error("Usuario es requerido");
    }
    this.venta.usuario_id = usuarioId;
    return this;
  }

  setNumeroFactura(numero) {
    this.venta.numero_factura = numero;
    return this;
  }

  setFechaHora(fechaHora) {
    if (fechaHora) {
      this.venta.fecha_hora = fechaHora;
    }
    return this;
  }

  build() {
    // Validaciones finales antes de construir
    if (!this.venta.cliente_id) {
      throw new Error("Cliente es requerido");
    }
    if (!this.venta.itemsAgregados || this.venta.itemsAgregados.length === 0) {
      throw new Error("Debe agregar al menos un item");
    }
    if (!this.venta.usuario_id) {
      throw new Error("Usuario es requerido");
    }
    if (!this.venta.totalSinDescuento || parseFloat(this.venta.totalSinDescuento) <= 0) {
      throw new Error("El total debe ser mayor a 0");
    }

    return { ...this.venta };
  }
}

export default VentaBuilder;



