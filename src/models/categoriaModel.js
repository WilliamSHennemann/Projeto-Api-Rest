const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id, nome, descricao, created_at, updated_at FROM categorias ORDER BY id'
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, nome, descricao, created_at, updated_at FROM categorias WHERE id = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
};

const create = async ({ nome, descricao }) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
    [nome, descricao || null]
  );

  return findById(result.insertId);
};

const update = async (id, { nome, descricao }) => {
  await pool.execute(
    'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
    [nome, descricao || null, id]
  );

  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
