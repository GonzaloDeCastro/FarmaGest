#!/usr/bin/env node

const { query } = require('../config/database');

const buildQuery = `
  SELECT
    DATE(v.fecha) AS fecha,
    COUNT(*) AS cantidad_ventas,
    COALESCE(SUM(v.total), 0) AS monto_total
  FROM ventas v
  GROUP BY DATE(v.fecha)
  ORDER BY DATE(v.fecha)
`;

(async () => {
  try {
    const result = await query(buildQuery);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();

