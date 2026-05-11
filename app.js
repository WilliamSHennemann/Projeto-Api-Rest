const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const eventRoutes = require('./src/routes/eventRoutes');

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware para ler JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/events', eventRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Gestão de Eventos' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Conectar ao banco e iniciar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Endpoints: http://localhost:${PORT}/api/events`);
  });
};

startServer();