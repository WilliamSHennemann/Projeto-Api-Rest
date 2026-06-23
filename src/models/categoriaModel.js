const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias ORDER BY id_categoria'
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias WHERE id_categoria = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
};

const create = async ({ nome }) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome]
  );

  return findById(result.insertId);
};

const update = async (id, { nome }) => {
  await pool.execute(
    'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
    [nome, id]
  );

  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
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
