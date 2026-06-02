const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/AuthRoutes');
const eventRoutes = require('./src/routes/EventRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Setup - DEVE vir PRIMEIRO
const swaggerSpec = require('./src/config/swagger');

app.get('/swagger.json', (req, res) => {
  res.type('application/json');
  res.send(swaggerSpec);
});

// Swagger UI - sem app.get('api-docs') porque causa loop
app.use('/api-docs/', swaggerUi.serve);
app.get('/api-docs/', swaggerUi.setup(swaggerSpec));

// Redirect sem barra para com barra
app.get('/api-docs', (req, res) => {
  res.redirect(301, '/api-docs/');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Olá, mundo!' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
  console.log(`✓ Swagger disponível em http://localhost:${PORT}/api-docs/`);
});