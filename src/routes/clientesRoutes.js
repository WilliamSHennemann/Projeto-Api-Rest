const express = require('express');
const auth = require('../middleware/auth');
const requireUserId = require('../middleware/requireUserId');
const {
  listarClientes,
  buscarClientePorId,
  listarEnderecosDoCliente,
  criarCliente,
  atualizarCliente,
  deletarCliente
} = require('../controllers/clienteController');

const router = express.Router();

router.use(auth, requireUserId);

router.get('/', listarClientes);
router.get('/:id/enderecos', listarEnderecosDoCliente);
router.get('/:id', buscarClientePorId);
router.post('/', criarCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', deletarCliente);

module.exports = router;
