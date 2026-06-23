const express = require('express');
const auth = require('../middleware/auth');
const requireUserId = require('../middleware/requireUserId');
const {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
} = require('../controllers/pedidoController');

const router = express.Router();

router.use(auth, requireUserId);

router.get('/', listarPedidos);
router.get('/:id', buscarPedidoPorId);
router.post('/', criarPedido);
router.put('/:id', atualizarPedido);
router.delete('/:id', deletarPedido);

module.exports = router;
