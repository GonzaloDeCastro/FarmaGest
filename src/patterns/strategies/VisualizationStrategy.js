/**
 * Strategy Pattern para diferentes tipos de visualización de reportes
 * Permite cambiar algoritmos de renderizado dinámicamente
 */

// Estrategia base
class VisualizationStrategy {
  render(data) {
    throw new Error("Método render debe ser implementado");
  }
}

// Estrategia: Tabla
class TableVisualizationStrategy extends VisualizationStrategy {
  constructor(styles) {
    super();
    this.styles = styles;
  }

  render(data) {
    // Si data está vacío, usar reportes originales
    const reportesToShow = data && data.length > 0 ? data : [];
    
    return (
      <div className={this.styles.tableContainer}>
        <table className={this.styles.headerTable}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cantidad de Ventas</th>
              <th>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {reportesToShow.length > 0 ? (
              reportesToShow.map((reporte, index) => (
                <tr key={index}>
                  <td>{reporte.fecha ? reporte.fecha.slice(0, 10) : reporte.fecha}</td>
                  <td>{reporte.cantidad_ventas}</td>
                  <td>${reporte.monto || reporte.monto_total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={this.styles.noData}>
                  No hay ventas en este rango de fecha
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

// Estrategia: Gráfico de Montos
class AmountChartStrategy extends VisualizationStrategy {
  constructor(maxMonto, styles) {
    super();
    this.maxMonto = maxMonto;
    this.styles = styles;
  }

  render(data) {
    return (
      <div className={this.styles.chartContainer}>
        <div className={this.styles.yAxis}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className={this.styles.yAxisLine}>
              <div className={this.styles.yGuideLine}></div>
            </div>
          ))}
        </div>
        <div className={this.styles.bars}>
          {data.map((item, index) => (
            <div key={index} className={this.styles.barWrapper}>
              <div
                className={this.styles.bar}
                style={{ height: `${(item.monto / this.maxMonto) * 100}%` }}
              >
                <span className={this.styles.barLabel}>
                  ${item.monto.toLocaleString()}
                </span>
              </div>
              <div className={this.styles.label}>{item.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// Estrategia: Gráfico de Cantidad de Ventas
class QuantityChartStrategy extends VisualizationStrategy {
  constructor(maxCantidadVentas, styles) {
    super();
    this.maxCantidadVentas = maxCantidadVentas;
    this.styles = styles;
  }

  render(data) {
    return (
      <div className={this.styles.chartContainer}>
        <div className={this.styles.yAxis}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className={this.styles.yAxisLine}>
              <div className={this.styles.yGuideLine}></div>
            </div>
          ))}
        </div>
        <div className={this.styles.bars}>
          {data.map((item, index) => (
            <div key={index} className={this.styles.barWrapper}>
              <div
                className={this.styles.barCantidad}
                style={{
                  height: `${(item.cantidad_ventas / this.maxCantidadVentas) * 100}%`,
                }}
              >
                <span className={this.styles.barLabel}>
                  {item.cantidad_ventas.toLocaleString()}
                </span>
              </div>
              <div className={this.styles.label}>{item.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// Factory para crear estrategias
class VisualizationStrategyFactory {
  static createStrategy(type, data, styles) {
    if (!data || data.length === 0) {
      return new TableVisualizationStrategy(styles);
    }

    const maxMonto = Math.max(...data.map((item) => item.monto));
    const maxCantidadVentas = Math.max(...data.map((item) => item.cantidad_ventas));

    switch (type) {
      case "table":
        return new TableVisualizationStrategy(styles);
      case "amount-chart":
        return new AmountChartStrategy(maxMonto, styles);
      case "quantity-chart":
        return new QuantityChartStrategy(maxCantidadVentas, styles);
      default:
        return new TableVisualizationStrategy(styles);
    }
  }
}

export { VisualizationStrategyFactory, VisualizationStrategy };

