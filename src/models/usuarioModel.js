const { pool } = require('../config/database');

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ? LIMIT 1',
    [email]
  );

  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, perfil FROM usuarios WHERE id = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
};

const create = async ({ nome, email, senha, perfil = 'usuario' }) => {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
    [nome, email, senha, perfil]
  );

  return findById(result.insertId);
};

module.exports = {
  findByEmail,
  findById,
  create
};
