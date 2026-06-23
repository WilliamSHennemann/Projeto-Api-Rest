const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id_produto, p.nome, p.valor, p.estoque, p.categorias_id_categoria,
            c.nome AS categoria_nome
       FROM produtos p
       INNER JOIN categorias c ON c.id_categoria = p.categorias_id_categoria
      ORDER BY p.id_produto`
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT p.id_produto, p.nome, p.valor, p.estoque, p.categorias_id_categoria,
            c.nome AS categoria_nome
       FROM produtos p
       INNER JOIN categorias c ON c.id_categoria = p.categorias_id_categoria
      WHERE p.id_produto = ?
      LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

const create = async ({ nome, valor, estoque, categorias_id_categoria }) => {
  const [result] = await pool.execute(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome, valor, estoque ?? 1, categorias_id_categoria]
  );

  return findById(result.insertId);
};

const update = async (id, { nome, valor, estoque, categorias_id_categoria }) => {
  await pool.execute(
    'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
    [nome, valor, estoque ?? 1, categorias_id_categoria, id]
  );

  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM produtos WHERE id_produto = ?',
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
