const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id_pedido, p.data, p.clientes_id_cliente, c.nome AS cliente_nome
       FROM pedidos p
       INNER JOIN clientes c ON c.id_cliente = p.clientes_id_cliente
      ORDER BY p.id_pedido`
  );

  return rows;
};

const findItensByPedidoId = async (pedidoId) => {
  const [rows] = await pool.execute(
    `SELECT pp.produtos_id_produto, pr.nome AS produto_nome,
            pp.pedidos_id_pedido, pp.quantidade, pp.valor
       FROM produtos_pedidos pp
       INNER JOIN produtos pr ON pr.id_produto = pp.produtos_id_produto
      WHERE pp.pedidos_id_pedido = ?
      ORDER BY pp.produtos_id_produto`,
    [pedidoId]
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT p.id_pedido, p.data, p.clientes_id_cliente, c.nome AS cliente_nome
       FROM pedidos p
       INNER JOIN clientes c ON c.id_cliente = p.clientes_id_cliente
      WHERE p.id_pedido = ?
      LIMIT 1`,
    [id]
  );

  const pedido = rows[0] || null;
  if (!pedido) return null;

  pedido.itens = await findItensByPedidoId(id);
  return pedido;
};

const create = async ({ data, clientes_id_cliente, itens = [] }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
      [data, clientes_id_cliente]
    );

    const pedidoId = result.insertId;

    for (const item of itens) {
      await connection.execute(
        'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
        [item.produtos_id_produto, pedidoId, item.quantidade, item.valor]
      );
    }

    await connection.commit();
    return findById(pedidoId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const update = async (id, { data, clientes_id_cliente, itens }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE pedidos SET data = ?, clientes_id_cliente = ? WHERE id_pedido = ?',
      [data, clientes_id_cliente, id]
    );

    if (Array.isArray(itens)) {
      await connection.execute(
        'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
        [id]
      );

      for (const item of itens) {
        await connection.execute(
          'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
          [item.produtos_id_produto, id, item.quantidade, item.valor]
        );
      }
    }

    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const remove = async (id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
      [id]
    );

    const [result] = await connection.execute(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [id]
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
