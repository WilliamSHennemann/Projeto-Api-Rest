const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      usuarioId: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const isValidPassword = async (password, storedPassword) => {
  if (!storedPassword) return false;
  if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
    return bcrypt.compare(password, storedPassword);
  }
  return password === storedPassword;
};

const register = async (req, res) => {
  try {
    const { nome, name, email, senha, password, perfil } = req.body;
    const userName = nome || name;
    const userPassword = senha || password;

    if (!userName || !email || !userPassword) {
      return res.status(400).json({ message: 'Nome, email e senha sao obrigatorios' });
    }

    const existingUser = await usuarioModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email ja cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const usuario = await usuarioModel.create({ nome: userName, email, senha: hashedPassword, perfil });

    return res.status(201).json({ success: true, token: generateToken(usuario), usuario });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao cadastrar usuario', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha, password } = req.body;
    const userPassword = senha || password;

    if (!email || !userPassword) {
      return res.status(400).json({ message: 'Email e senha sao obrigatorios' });
    }

    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const passwordMatches = await isValidPassword(userPassword, usuario.senha);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    return res.json({
      success: true,
      token: generateToken(usuario),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const usuario = await usuarioModel.findById(req.userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario nao encontrado' });
    }
    return res.json({ success: true, usuario });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
