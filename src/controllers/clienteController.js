const clienteModel = require('../models/clienteModel');

const statusValidos = ['bom', 'medio', 'ruim'];

const listarClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.findAll();
    return res.json({ success: true, clientes });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar clientes', error: error.message });
  }
};

const buscarClientePorId = async (req, res) => {
  try {
    const cliente = await clienteModel.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente nao encontrado' });
    return res.json({ success: true, cliente });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
};

const listarEnderecosDoCliente = async (req, res) => {
  try {
    const cliente = await clienteModel.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente nao encontrado' });
    const enderecos = await clienteModel.findEnderecoByClienteId(req.params.id);
    return res.json({ success: true, cliente, enderecos });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar enderecos', error: error.message });
  }
};

const criarCliente = async (req, res) => {
  try {
    const { nome, telefone, status } = req.body;
    if (!nome || !telefone) return res.status(400).json({ message: 'Nome e telefone sao obrigatorios' });
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ message: 'Status deve ser bom, medio ou ruim' });
    }
    const cliente = await clienteModel.create({ nome, telefone, status });
    return res.status(201).json({ success: true, cliente });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
};

const atualizarCliente = async (req, res) => {
  try {
    const { nome, telefone, status } = req.body;
    if (!nome || !telefone) return res.status(400).json({ message: 'Nome e telefone sao obrigatorios' });
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ message: 'Status deve ser bom, medio ou ruim' });
    }
    const clienteAtual = await clienteModel.findById(req.params.id);
    if (!clienteAtual) return res.status(404).json({ message: 'Cliente nao encontrado' });
    const cliente = await clienteModel.update(req.params.id, { nome, telefone, status });
    return res.json({ success: true, cliente });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
};

const deletarCliente = async (req, res) => {
  try {
    const removed = await clienteModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Cliente nao encontrado' });
    return res.json({ success: true, message: 'Cliente removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover cliente', error: error.message });
  }
};

module.exports = {
  listarClientes,
  buscarClientePorId,
  listarEnderecosDoCliente,
  criarCliente,
  atualizarCliente,
  deletarCliente
};
