const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes ORDER BY id_cliente'
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes WHERE id_cliente = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
};

const findEnderecoByClienteId = async (clienteId) => {
  const [rows] = await pool.execute(
    `SELECT id_endereco, logradouro, numero, tipo, bairro, cep, cidade, clientes_id_cliente
       FROM endereco
      WHERE clientes_id_cliente = ?
      ORDER BY id_endereco`,
    [clienteId]
  );

  return rows;
};

const create = async ({ nome, telefone, status }) => {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome, telefone, status || 'medio']
  );

  return findById(result.insertId);
};

const update = async (id, { nome, telefone, status }) => {
  await pool.execute(
    'UPDATE clientes SET nome = ?, telefone = ?, status = ? WHERE id_cliente = ?',
    [nome, telefone, status || 'medio', id]
  );

  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM clientes WHERE id_cliente = ?',
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findEnderecoByClienteId,
  create,
  update,
  remove
};
