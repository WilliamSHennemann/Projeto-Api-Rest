const express = require('express');
const auth = require('../middleware/auth');
const requireUserId = require('../middleware/requireUserId');
const {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
} = require('../controllers/produtoController');

const router = express.Router();

router.use(auth, requireUserId);

router.get('/', listarProdutos);
router.get('/:id', buscarProdutoPorId);
router.post('/', criarProduto);
router.put('/:id', atualizarProduto);
router.delete('/:id', deletarProduto);

module.exports = router;
