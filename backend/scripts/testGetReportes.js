#!/usr/bin/env node

const { getReportes } = require('../controllers/otrosController');

const mockReq = {
  query: {
    dateSelectedFrom: '',
    dateSelectedTo: '',
    entitySelected: '',
    clienteProductoVendedor: '',
  },
};

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    console.log('Status:', this.statusCode || 200);
    console.log('Payload:', JSON.stringify(payload, null, 2));
  },
};

getReportes(mockReq, mockRes).catch((error) => {
  console.error('Error ejecutando getReportes:', error);
  process.exitCode = 1;
});

