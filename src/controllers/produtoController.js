const produtoModel = require('../models/produtoModel');

const listarProdutos = async (req, res) => {
  try {
    const produtos = await produtoModel.findAll();
    return res.json({ success: true, produtos });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
  }
};

const buscarProdutoPorId = async (req, res) => {
  try {
    const produto = await produtoModel.findById(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto nao encontrado' });
    return res.json({ success: true, produto });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

const criarProduto = async (req, res) => {
  try {
    const { nome, valor, estoque, categorias_id_categoria } = req.body;
    if (!nome || valor === undefined || !categorias_id_categoria) {
      return res.status(400).json({ message: 'Nome, valor e categorias_id_categoria sao obrigatorios' });
    }
    const produto = await produtoModel.create({ nome, valor, estoque, categorias_id_categoria });
    return res.status(201).json({ success: true, produto });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

const atualizarProduto = async (req, res) => {
  try {
    const { nome, valor, estoque, categorias_id_categoria } = req.body;
    if (!nome || valor === undefined || !categorias_id_categoria) {
      return res.status(400).json({ message: 'Nome, valor e categorias_id_categoria sao obrigatorios' });
    }
    const produtoAtual = await produtoModel.findById(req.params.id);
    if (!produtoAtual) return res.status(404).json({ message: 'Produto nao encontrado' });
    const produto = await produtoModel.update(req.params.id, { nome, valor, estoque, categorias_id_categoria });
    return res.json({ success: true, produto });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

const deletarProduto = async (req, res) => {
  try {
    const removed = await produtoModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Produto nao encontrado' });
    return res.json({ success: true, message: 'Produto removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover produto', error: error.message });
  }
};

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
};
