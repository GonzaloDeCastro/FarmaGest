import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { FaMagic, FaShoppingCart, FaChartLine, FaTags } from "react-icons/fa";
import RecommendationService from "../../services/ai/RecommendationService";
import styles from "./ProductRecommendations.module.css";

const ProductRecommendations = ({
  clienteId,
  ventasHistoricas,
  productos,
  itemsYaAgregados,
  onAddProduct,
}) => {
  if (!clienteId || clienteId === 0) {
    return null;
  }

  // Obtener todas las recomendaciones
  const recommendations = RecommendationService.getAllRecommendations(
    clienteId,
    ventasHistoricas || [],
    productos || [],
    itemsYaAgregados || []
  );

  const hasRecommendations =
    recommendations.byClientHistory.length > 0 ||
    recommendations.topSelling.length > 0 ||
    recommendations.related.length > 0;

  if (!hasRecommendations) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <FaMagic className={styles.icon} />
          <h5>Recomendaciones IA</h5>
        </div>
        <p className={styles.noRecommendations}>
          No hay recomendaciones disponibles para este cliente aún.
        </p>
      </div>
    );
  }

  const handleAddProduct = (producto) => {
    if (onAddProduct) {
      onAddProduct({
        productoId: producto.producto_id,
        cantidad: 1,
        precio: producto.Precio,
        total: producto.Precio,
        nombre: producto.Nombre,
      });
    }
  };

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <FaMagic className={styles.icon} />
          <h5>Recomendaciones IA</h5>
        <Badge bg="primary" className={styles.badge}>
          {recommendations.byClientHistory.length +
            recommendations.topSelling.length +
            recommendations.related.length}
        </Badge>
      </div>

      {/* Recomendaciones basadas en historial del cliente */}
      {recommendations.byClientHistory.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaShoppingCart className={styles.sectionIcon} />
            <span>Basado en tu historial</span>
          </div>
          <div className={styles.productsGrid}>
            {recommendations.byClientHistory.map((producto) => (
              <Card key={producto.producto_id} className={styles.productCard}>
                <Card.Body>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{producto.Nombre}</div>
                    <div className={styles.productDetails}>
                      <span className={styles.code}>Cód: {producto.Codigo}</span>
                      <span className={styles.price}>${producto.Precio}</span>
                    </div>
                    <div className={styles.productReason}>
                      <small>{producto.reason}</small>
                    </div>
                    {producto.Stock > 0 ? (
                      <Badge bg="success" className={styles.stockBadge}>
                        Stock: {producto.Stock}
                      </Badge>
                    ) : (
                      <Badge bg="danger" className={styles.stockBadge}>
                        Sin stock
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    className={styles.addButton}
                    onClick={() => handleAddProduct(producto)}
                    disabled={producto.Stock <= 0}
                  >
                    <FaShoppingCart className={styles.buttonIcon} />
                    Agregar
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Productos más vendidos */}
      {recommendations.topSelling.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaChartLine className={styles.sectionIcon} />
            <span>Productos más vendidos</span>
          </div>
          <div className={styles.productsGrid}>
            {recommendations.topSelling.map((producto) => (
              <Card key={producto.producto_id} className={styles.productCard}>
                <Card.Body>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{producto.Nombre}</div>
                    <div className={styles.productDetails}>
                      <span className={styles.code}>Cód: {producto.Codigo}</span>
                      <span className={styles.price}>${producto.Precio}</span>
                    </div>
                    <div className={styles.productReason}>
                      <small>{producto.reason}</small>
                    </div>
                    {producto.Stock > 0 ? (
                      <Badge bg="success" className={styles.stockBadge}>
                        Stock: {producto.Stock}
                      </Badge>
                    ) : (
                      <Badge bg="danger" className={styles.stockBadge}>
                        Sin stock
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className={styles.addButton}
                    onClick={() => handleAddProduct(producto)}
                    disabled={producto.Stock <= 0}
                  >
                    <FaShoppingCart className={styles.buttonIcon} />
                    Agregar
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Productos relacionados */}
      {recommendations.related.length > 0 && itemsYaAgregados.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaTags className={styles.sectionIcon} />
            <span>Productos relacionados</span>
          </div>
          <div className={styles.productsGrid}>
            {recommendations.related.map((producto) => (
              <Card key={producto.producto_id} className={styles.productCard}>
                <Card.Body>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{producto.Nombre}</div>
                    <div className={styles.productDetails}>
                      <span className={styles.code}>Cód: {producto.Codigo}</span>
                      <span className={styles.price}>${producto.Precio}</span>
                    </div>
                    <div className={styles.productReason}>
                      <small>{producto.reason}</small>
                    </div>
                    {producto.Stock > 0 ? (
                      <Badge bg="info" className={styles.stockBadge}>
                        Stock: {producto.Stock}
                      </Badge>
                    ) : (
                      <Badge bg="danger" className={styles.stockBadge}>
                        Sin stock
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline-info"
                    className={styles.addButton}
                    onClick={() => handleAddProduct(producto)}
                    disabled={producto.Stock <= 0}
                  >
                    <FaShoppingCart className={styles.buttonIcon} />
                    Agregar
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;

