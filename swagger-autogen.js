const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'API REST da Loja',
    description: 'API com autenticacao JWT, MySQL e CRUD protegido de categorias',
    version: process.env.API_VERSION || '2.0.0'
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
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './app.js',
  './src/routes/apiRoutes.js',
  './src/routes/authRoutes.js',
  './src/routes/categoriaRoutes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger gerado em swagger-output.json');
});
