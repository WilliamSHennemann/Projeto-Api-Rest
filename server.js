const app = require('./app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Status: http://localhost:${PORT}/api/status`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs/`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();
