const swaggerJsdoc = require('swagger-jsdoc');

const getSwaggerSpec = () => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Gerenciamento de Eventos',
        version: '1.0.0',
        description: 'API para gerenciar eventos com autenticação JWT'
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
            bearerFormat: 'JWT',
            description: 'Token JWT para autenticação'
          }
        }
      }
    },
    apis: ['./src/routes/*.js']
  };

  try {
    const spec = swaggerJsdoc(swaggerOptions);
    console.log('✓ Swagger spec gerado com sucesso');
    return spec;
  } catch (error) {
    console.error('✗ Erro ao gerar Swagger spec:', error.message);
    throw error;
  }
};

module.exports = getSwaggerSpec();
