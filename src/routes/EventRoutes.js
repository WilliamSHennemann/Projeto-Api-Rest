const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerEvent,
  unregisterEvent,
  getMyCreatedEvents,
  getMyRegisteredEvents
} = require('../controllers/EventController');
const auth = require('../middleware/auth');

// Rotas específicas DEVEM vir PRIMEIRO, antes das rotas genéricas com :id

/**
 * @swagger
 * /api/events/user/created:
 *   get:
 *     summary: Listar meus eventos criados
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos criados
 */
router.get('/user/created', auth, getMyCreatedEvents);

/**
 * @swagger
 * /api/events/user/registered:
 *   get:
 *     summary: Listar meus eventos registrados
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos participando
 */
router.get('/user/registered', auth, getMyRegisteredEvents);

/**
 * @swagger
 * /api/events/hello:
 *   get:
 *     summary: Retorna uma mensagem de boas-vindas
 *     tags:
 *       - Geral
 *     responses:
 *       200:
 *         description: Mensagem de sucesso
 */
router.get('/hello', (req, res) => {
  res.json({ message: 'Olá, mundo!' });
});

// Rotas genéricas VÊM DEPOIS

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Listar todos os eventos
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Criar novo evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               category:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Erro ao criar evento
 */
router.post('/', auth, createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obter detalhes de um evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       403:
 *         description: Sem permissão para atualizar
 */
router.put('/:id', auth, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Deletar evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
 *       403:
 *         description: Sem permissão para deletar
 */
router.delete('/:id', auth, deleteEvent);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Registrar em um evento
 *     tags:
 *       - Participação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registrado no evento com sucesso
 *       400:
 *         description: Erro ao registrar
 */
router.post('/:id/register', auth, registerEvent);

/**
 * @swagger
 * /api/events/{id}/unregister:
 *   post:
 *     summary: Desregistrar de um evento
 *     tags:
 *       - Participação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Desregistrado do evento
 */
router.post('/:id/unregister', auth, unregisterEvent);

module.exports = router;