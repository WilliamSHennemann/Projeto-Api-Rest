CREATE DATABASE IF NOT EXISTS loja;
USE loja;

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS produtos_pedidos;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(40) NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id),
  UNIQUE KEY email_UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE categorias (
  id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_categoria),
  UNIQUE KEY idcategoria_UNIQUE (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE clientes (
  id_cliente INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  status ENUM('bom','medio','ruim') DEFAULT 'medio',
  PRIMARY KEY (id_cliente),
  UNIQUE KEY id_cliente_UNIQUE (id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE endereco (
  id_endereco INT UNSIGNED NOT NULL AUTO_INCREMENT,
  logradouro VARCHAR(45) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  bairro VARCHAR(45) NOT NULL,
  cep VARCHAR(12) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  clientes_id_cliente INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_endereco),
  UNIQUE KEY id_endereco_UNIQUE (id_endereco),
  KEY fk_endereco_clientes_idx (clientes_id_cliente),
  CONSTRAINT fk_endereco_clientes FOREIGN KEY (clientes_id_cliente) REFERENCES clientes (id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE pedidos (
  id_pedido INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data DATE NOT NULL,
  clientes_id_cliente INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_pedido),
  UNIQUE KEY id_pedido_UNIQUE (id_pedido),
  KEY fk_pedidos_clientes1_idx (clientes_id_cliente),
  CONSTRAINT fk_pedidos_clientes1 FOREIGN KEY (clientes_id_cliente) REFERENCES clientes (id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE produtos (
  id_produto INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  valor DOUBLE NOT NULL,
  estoque INT NOT NULL DEFAULT 1,
  categorias_id_categoria INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_produto),
  UNIQUE KEY id_produto_UNIQUE (id_produto),
  KEY fk_produtos_categorias1_idx (categorias_id_categoria),
  CONSTRAINT fk_produtos_categorias1 FOREIGN KEY (categorias_id_categoria) REFERENCES categorias (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE produtos_pedidos (
  produtos_id_produto INT UNSIGNED NOT NULL,
  pedidos_id_pedido INT UNSIGNED NOT NULL,
  quantidade DOUBLE NOT NULL,
  valor DOUBLE NOT NULL,
  PRIMARY KEY (produtos_id_produto, pedidos_id_pedido),
  KEY fk_produtos_has_pedidos_pedidos1_idx (pedidos_id_pedido),
  KEY fk_produtos_has_pedidos_produtos1_idx (produtos_id_produto),
  CONSTRAINT fk_produtos_has_pedidos_pedidos1 FOREIGN KEY (pedidos_id_pedido) REFERENCES pedidos (id_pedido),
  CONSTRAINT fk_produtos_has_pedidos_produtos1 FOREIGN KEY (produtos_id_produto) REFERENCES produtos (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

SET FOREIGN_KEY_CHECKS=1;

INSERT INTO usuarios (id, nome, email, senha, perfil)
VALUES (1, 'Administrador', 'admin@loja.com', '123456', 'admin')
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO categorias (id_categoria, nome)
VALUES (1, 'Geral')
ON DUPLICATE KEY UPDATE nome = nome;
