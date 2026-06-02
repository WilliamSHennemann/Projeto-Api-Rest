const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {
  info: {
    title: 'Minha API Simples',
    version: '1.0.0',
    description: 'Exemplo de API básica com Swagger',
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = path.join(__dirname, 'swagger.json');
const endpointsFiles = [path.join(__dirname, 'src/routes/EventRoutes.js')];

swaggerAutogen.generateApi(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');
});