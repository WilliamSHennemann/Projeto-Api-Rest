const pedidoModel = require('../models/pedidoModel');

const validarItens = (itens) => {
  if (!Array.isArray(itens)) return true;
  return itens.every((item) => (
    item.produtos_id_produto &&
    item.quantidade !== undefined &&
    item.valor !== undefined
  ));
};

const listarPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.findAll();
    return res.json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar pedidos', error: error.message });
  }
};

const buscarPedidoPorId = async (req, res) => {
  try {
    const pedido = await pedidoModel.findById(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido nao encontrado' });
    return res.json({ success: true, pedido });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
};

const criarPedido = async (req, res) => {
  try {
    const { data, clientes_id_cliente, itens } = req.body;
    if (!data || !clientes_id_cliente) {
      return res.status(400).json({ message: 'Data e clientes_id_cliente sao obrigatorios' });
    }
    if (!validarItens(itens)) {
      return res.status(400).json({ message: 'Itens devem conter produtos_id_produto, quantidade e valor' });
    }
    const pedido = await pedidoModel.create({ data, clientes_id_cliente, itens });
    return res.status(201).json({ success: true, pedido });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

const atualizarPedido = async (req, res) => {
  try {
    const { data, clientes_id_cliente, itens } = req.body;
    if (!data || !clientes_id_cliente) {
      return res.status(400).json({ message: 'Data e clientes_id_cliente sao obrigatorios' });
    }
    if (!validarItens(itens)) {
      return res.status(400).json({ message: 'Itens devem conter produtos_id_produto, quantidade e valor' });
    }
    const pedidoAtual = await pedidoModel.findById(req.params.id);
    if (!pedidoAtual) return res.status(404).json({ message: 'Pedido nao encontrado' });
    const pedido = await pedidoModel.update(req.params.id, { data, clientes_id_cliente, itens });
    return res.json({ success: true, pedido });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
  }
};

const deletarPedido = async (req, res) => {
  try {
    const removed = await pedidoModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Pedido nao encontrado' });
    return res.json({ success: true, message: 'Pedido removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover pedido', error: error.message });
  }
};

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
};
