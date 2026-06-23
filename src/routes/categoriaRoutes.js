const express = require('express');
const auth = require('../middleware/auth');
const requireUserId = require('../middleware/requireUserId');
const {
  listarCategorias,
  buscarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria
} = require('../controllers/categoriaController');

const router = express.Router();

router.use(auth, requireUserId);

router.get('/', listarCategorias);
router.get('/:id', buscarCategoriaPorId);
router.post('/', criarCategoria);
router.put('/:id', atualizarCategoria);
router.delete('/:id', deletarCategoria);

module.exports = router;
