const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const generatedSwaggerPath = path.resolve(__dirname, '../../swagger-output.json');

let swaggerSpec;

if (fs.existsSync(generatedSwaggerPath)) {
  swaggerSpec = require(generatedSwaggerPath);
} else {
  swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API REST da Loja',
        version: process.env.API_VERSION || '2.0.0',
        description: 'API com autenticacao JWT e persistencia MySQL'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Servidor local'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
  });
}

module.exports = swaggerSpec;
