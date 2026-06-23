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
      },
      // Adicionando a definição do header x-user-id
      userIdAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-user-id',
        description: 'Insira o ID do usuário para identificação nas requisições'
      }
    }
  },
  // Aplicando ambos globalmente (o usuário precisará preencher os dois no Swagger UI)
  security: [
    { 
      bearerAuth: [],
      userIdAuth: [] 
    }
  ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger gerado em swagger-output.json');
});
