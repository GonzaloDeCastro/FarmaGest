/**
 * Servicio de IA para Recomendaciones de Productos
 * Implementa algoritmos simples de machine learning para recomendar productos
 */

class RecommendationService {
  /**
   * Obtiene recomendaciones basadas en el historial del cliente
   * @param {number} clienteId - ID del cliente
   * @param {Array} ventasHistoricas - Array de ventas históricas
   * @param {Array} productos - Array de todos los productos disponibles
   * @param {Array} itemsYaAgregados - Items ya agregados a la venta actual
   * @returns {Array} Array de productos recomendados ordenados por relevancia
   */
  static getRecommendationsByClientHistory(clienteId, ventasHistoricas, productos, itemsYaAgregados = []) {
    if (!ventasHistoricas || ventasHistoricas.length === 0) {
      return [];
    }

    // Filtrar ventas del cliente
    const ventasCliente = ventasHistoricas.filter(
      (venta) => venta.cliente_id === clienteId
    );

    if (ventasCliente.length === 0) {
      return [];
    }

    // Extraer productos comprados por el cliente
    const productosComprados = new Map(); // producto_id -> cantidad total

    ventasCliente.forEach((venta) => {
      // Manejar diferentes estructuras de datos: items o itemsAgregados
      const items = venta.items || venta.itemsAgregados || [];
      
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((item) => {
          // Manejar diferentes nombres de propiedades
          const productoId = item.producto_id || item.productoId;
          const cantidad = item.cantidad || 1;
          
          if (productoId) {
            if (productosComprados.has(productoId)) {
              productosComprados.set(
                productoId,
                productosComprados.get(productoId) + cantidad
              );
            } else {
              productosComprados.set(productoId, cantidad);
            }
          }
        });
      }
    });

    // Obtener categorías y marcas más compradas
    const categoriasFrecuentes = new Map();
    const marcasFrecuentes = new Map();

    productosComprados.forEach((cantidad, productoId) => {
      const producto = productos.find((p) => p.producto_id === productoId);
      if (producto) {
        // Contar categorías
        if (producto.categoria_id) {
          categoriasFrecuentes.set(
            producto.categoria_id,
            (categoriasFrecuentes.get(producto.categoria_id) || 0) + cantidad
          );
        }
        // Contar marcas
        if (producto.Marca) {
          marcasFrecuentes.set(
            producto.Marca,
            (marcasFrecuentes.get(producto.Marca) || 0) + cantidad
          );
        }
      }
    });

    // Calcular puntuación de recomendación para cada producto
    const recomendaciones = productos
      .filter((producto) => {
        // Excluir productos ya agregados
        return !itemsYaAgregados.some(
          (item) => item.productoId === producto.producto_id
        );
      })
      .map((producto) => {
        let score = 0;

        // Puntos por haberlo comprado antes
        if (productosComprados.has(producto.producto_id)) {
          score += 100; // Base alta para productos ya comprados
          score += productosComprados.get(producto.producto_id) * 10; // Más puntos por frecuencia
        }

        // Puntos por categoría similar
        if (producto.categoria_id && categoriasFrecuentes.has(producto.categoria_id)) {
          score += categoriasFrecuentes.get(producto.categoria_id) * 5;
        }

        // Puntos por marca similar
        if (producto.Marca && marcasFrecuentes.has(producto.Marca)) {
          score += marcasFrecuentes.get(producto.Marca) * 3;
        }

        return {
          ...producto,
          recommendationScore: score,
          reason: this.getRecommendationReason(producto, productosComprados, categoriasFrecuentes, marcasFrecuentes),
        };
      })
      .filter((producto) => producto.recommendationScore > 0) // Solo productos con score > 0
      .sort((a, b) => b.recommendationScore - a.recommendationScore) // Ordenar por score
      .slice(0, 6); // Top 6 recomendaciones

    return recomendaciones;
  }

  /**
   * Obtiene productos más vendidos (recomendaciones generales)
   * @param {Array} ventasHistoricas - Array de ventas históricas
   * @param {Array} productos - Array de todos los productos
   * @param {Array} itemsYaAgregados - Items ya agregados
   * @returns {Array} Array de productos más vendidos
   */
  static getTopSellingProducts(ventasHistoricas, productos, itemsYaAgregados = []) {
    if (!ventasHistoricas || ventasHistoricas.length === 0) {
      return [];
    }

    const productosVendidos = new Map(); // producto_id -> cantidad total vendida

    ventasHistoricas.forEach((venta) => {
      // Manejar diferentes estructuras de datos
      const items = venta.items || venta.itemsAgregados || [];
      
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((item) => {
          // Manejar diferentes nombres de propiedades
          const productoId = item.producto_id || item.productoId;
          const cantidad = item.cantidad || 1;

          if (productoId) {
            if (productosVendidos.has(productoId)) {
              productosVendidos.set(
                productoId,
                productosVendidos.get(productoId) + cantidad
              );
            } else {
              productosVendidos.set(productoId, cantidad);
            }
          }
        });
      }
    });

    const topSelling = productos
      .filter((producto) => {
        return !itemsYaAgregados.some(
          (item) => item.productoId === producto.producto_id
        );
      })
      .map((producto) => {
        const cantidadVendida = productosVendidos.get(producto.producto_id) || 0;
        return {
          ...producto,
          recommendationScore: cantidadVendida,
          reason: `Producto más vendido (${cantidadVendida} unidades)`,
        };
      })
      .filter((producto) => producto.recommendationScore > 0)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 5); // Top 5 más vendidos

    return topSelling;
  }

  /**
   * Obtiene productos relacionados por categoría
   * @param {Array} productosAgregados - Productos ya agregados a la venta
   * @param {Array} productos - Array de todos los productos
   * @returns {Array} Array de productos relacionados
   */
  static getRelatedProducts(productosAgregados, productos) {
    if (!productosAgregados || productosAgregados.length === 0) {
      return [];
    }

    // Obtener categorías de productos agregados
    const categoriasAgregadas = new Set();
    productosAgregados.forEach((item) => {
      const producto = productos.find((p) => p.producto_id === item.productoId);
      if (producto && producto.categoria_id) {
        categoriasAgregadas.add(producto.categoria_id);
      }
    });

    if (categoriasAgregadas.size === 0) {
      return [];
    }

    const productosRelacionados = productos
      .filter((producto) => {
        // Excluir productos ya agregados
        return (
          !productosAgregados.some((item) => item.productoId === producto.producto_id) &&
          categoriasAgregadas.has(producto.categoria_id)
        );
      })
      .map((producto) => ({
        ...producto,
        recommendationScore: 50, // Score base para productos relacionados
        reason: "Producto relacionado por categoría",
      }))
      .slice(0, 4); // Top 4 relacionados

    return productosRelacionados;
  }

  /**
   * Obtiene todas las recomendaciones combinadas
   * @param {number} clienteId - ID del cliente
   * @param {Array} ventasHistoricas - Ventas históricas
   * @param {Array} productos - Todos los productos
   * @param {Array} itemsYaAgregados - Items ya agregados
   * @returns {Object} Objeto con diferentes tipos de recomendaciones
   */
  static getAllRecommendations(clienteId, ventasHistoricas, productos, itemsYaAgregados = []) {
    const byHistory = this.getRecommendationsByClientHistory(
      clienteId,
      ventasHistoricas,
      productos,
      itemsYaAgregados
    );
    
    const topSelling = this.getTopSellingProducts(
      ventasHistoricas,
      productos,
      itemsYaAgregados
    );

    const related = this.getRelatedProducts(itemsYaAgregados, productos);

    return {
      byClientHistory: byHistory,
      topSelling: topSelling,
      related: related,
    };
  }

  /**
   * Genera una razón legible para la recomendación
   * @private
   */
  static getRecommendationReason(producto, productosComprados, categoriasFrecuentes, marcasFrecuentes) {
    const reasons = [];

    if (productosComprados.has(producto.producto_id)) {
      const cantidad = productosComprados.get(producto.producto_id);
      reasons.push(`Lo compraste ${cantidad} vez${cantidad > 1 ? "es" : ""} antes`);
    }

    if (producto.categoria_id && categoriasFrecuentes.has(producto.categoria_id)) {
      reasons.push(`Categoría que frecuentas`);
    }

    if (producto.Marca && marcasFrecuentes.has(producto.Marca)) {
      reasons.push(`Marca que prefieres`);
    }

    return reasons.length > 0 ? reasons.join(" • ") : "Recomendado para ti";
  }
}

export default RecommendationService;

