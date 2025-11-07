/**
 * Tests unitarios para el servicio de recomendaciones IA
 * Ejecutar con: npm test RecommendationService
 */

import RecommendationService from '../RecommendationService';

// Datos de prueba
const productosMock = [
  {
    producto_id: 1,
    Nombre: "Ibuprofeno 600mg",
    Codigo: "IBU600",
    Precio: 1500,
    Stock: 50,
    Marca: "Bayer",
    categoria_id: 1,
    Categoria: "Analgésicos",
  },
  {
    producto_id: 2,
    Nombre: "Paracetamol 500mg",
    Codigo: "PAR500",
    Precio: 800,
    Stock: 30,
    Marca: "Pfizer",
    categoria_id: 1,
    Categoria: "Analgésicos",
  },
  {
    producto_id: 3,
    Nombre: "Aspirina 100mg",
    Codigo: "ASP100",
    Precio: 600,
    Stock: 25,
    Marca: "Bayer",
    categoria_id: 1,
    Categoria: "Analgésicos",
  },
  {
    producto_id: 4,
    Nombre: "Vitamina C 1000mg",
    Codigo: "VITC1000",
    Precio: 2000,
    Stock: 40,
    Marca: "Nature",
    categoria_id: 2,
    Categoria: "Vitaminas",
  },
];

const ventasHistoricasMock = [
  {
    venta_id: 1,
    cliente_id: 1,
    fecha: "2024-01-15",
    items: [
      { producto_id: 1, cantidad: 2, precio: 1500 },
      { producto_id: 2, cantidad: 1, precio: 800 },
    ],
  },
  {
    venta_id: 2,
    cliente_id: 1,
    fecha: "2024-01-20",
    items: [
      { producto_id: 1, cantidad: 1, precio: 1500 },
      { producto_id: 3, cantidad: 3, precio: 600 },
    ],
  },
  {
    venta_id: 3,
    cliente_id: 2,
    fecha: "2024-01-18",
    items: [
      { producto_id: 4, cantidad: 1, precio: 2000 },
    ],
  },
];

describe('RecommendationService', () => {
  describe('getRecommendationsByClientHistory', () => {
    test('debe retornar recomendaciones basadas en historial del cliente', () => {
      const clienteId = 1;
      const itemsYaAgregados = [];

      const recomendaciones = RecommendationService.getRecommendationsByClientHistory(
        clienteId,
        ventasHistoricasMock,
        productosMock,
        itemsYaAgregados
      );

      expect(recomendaciones.length).toBeGreaterThan(0);
      expect(recomendaciones[0].producto_id).toBe(1); // Ibuprofeno comprado 2 veces
      expect(recomendaciones[0].recommendationScore).toBeGreaterThan(0);
    });

    test('debe retornar array vacío si no hay historial', () => {
      const recomendaciones = RecommendationService.getRecommendationsByClientHistory(
        999,
        ventasHistoricasMock,
        productosMock,
        []
      );

      expect(recomendaciones).toEqual([]);
    });

    test('debe excluir productos ya agregados', () => {
      const itemsYaAgregados = [{ productoId: 1 }];

      const recomendaciones = RecommendationService.getRecommendationsByClientHistory(
        1,
        ventasHistoricasMock,
        productosMock,
        itemsYaAgregados
      );

      const productoAgregado = recomendaciones.find(p => p.producto_id === 1);
      expect(productoAgregado).toBeUndefined();
    });
  });

  describe('getTopSellingProducts', () => {
    test('debe retornar productos más vendidos', () => {
      const recomendaciones = RecommendationService.getTopSellingProducts(
        ventasHistoricasMock,
        productosMock,
        []
      );

      expect(recomendaciones.length).toBeGreaterThan(0);
      expect(recomendaciones[0].producto_id).toBe(1); // Ibuprofeno más vendido (3 veces)
      expect(recomendaciones[0].recommendationScore).toBe(3);
    });

    test('debe retornar array vacío si no hay ventas', () => {
      const recomendaciones = RecommendationService.getTopSellingProducts(
        [],
        productosMock,
        []
      );

      expect(recomendaciones).toEqual([]);
    });
  });

  describe('getRelatedProducts', () => {
    test('debe retornar productos relacionados por categoría', () => {
      const itemsYaAgregados = [{ productoId: 1 }]; // Ibuprofeno (categoría 1)

      const relacionados = RecommendationService.getRelatedProducts(
        itemsYaAgregados,
        productosMock
      );

      expect(relacionados.length).toBeGreaterThan(0);
      // Debe incluir Paracetamol y Aspirina (misma categoría)
      const tieneParacetamol = relacionados.some(p => p.producto_id === 2);
      const tieneAspirina = relacionados.some(p => p.producto_id === 3);
      expect(tieneParacetamol || tieneAspirina).toBe(true);
    });

    test('debe retornar array vacío si no hay items agregados', () => {
      const relacionados = RecommendationService.getRelatedProducts(
        [],
        productosMock
      );

      expect(relacionados).toEqual([]);
    });
  });

  describe('getAllRecommendations', () => {
    test('debe retornar todas las recomendaciones organizadas', () => {
      const resultado = RecommendationService.getAllRecommendations(
        1,
        ventasHistoricasMock,
        productosMock,
        []
      );

      expect(resultado).toHaveProperty('byClientHistory');
      expect(resultado).toHaveProperty('topSelling');
      expect(resultado).toHaveProperty('related');
      expect(Array.isArray(resultado.byClientHistory)).toBe(true);
      expect(Array.isArray(resultado.topSelling)).toBe(true);
      expect(Array.isArray(resultado.related)).toBe(true);
    });
  });
});



