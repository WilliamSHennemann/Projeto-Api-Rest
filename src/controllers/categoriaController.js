const categoriaModel = require('../models/categoriaModel');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaModel.findAll();
    return res.json({ success: true, categorias });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar categorias',
      error: error.message
    });
  }
};

const buscarCategoriaPorId = async (req, res) => {
  try {
    const categoria = await categoriaModel.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoria nao encontrada' });
    }

    return res.json({ success: true, categoria });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar categoria',
      error: error.message
    });
  }
};

const criarCategoria = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'Nome da categoria e obrigatorio' });
    }

    const categoria = await categoriaModel.create({ nome, descricao });
    return res.status(201).json({ success: true, categoria });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao criar categoria',
      error: error.message
    });
  }
};

const atualizarCategoria = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'Nome da categoria e obrigatorio' });
    }

    const categoriaAtual = await categoriaModel.findById(req.params.id);
    if (!categoriaAtual) {
      return res.status(404).json({ message: 'Categoria nao encontrada' });
    }

    const categoria = await categoriaModel.update(req.params.id, { nome, descricao });
    return res.json({ success: true, categoria });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar categoria',
      error: error.message
    });
  }
};

const deletarCategoria = async (req, res) => {
  try {
    const removed = await categoriaModel.remove(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: 'Categoria nao encontrada' });
    }

    return res.json({ success: true, message: 'Categoria removida com sucesso' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao remover categoria',
      error: error.message
    });
  }
};

module.exports = {
  listarCategorias,
  buscarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria
};
