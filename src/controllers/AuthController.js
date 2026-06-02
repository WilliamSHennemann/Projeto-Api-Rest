const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Nome, email e senha são obrigatórios' 
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        message: 'Email já registrado' 
      });
    }

    // Role padrão é 'participant', apenas 'organizer' se solicitado
    const userRole = role === 'organizer' ? 'organizer' : 'participant';

    user = await User.create({ 
      name, 
      email, 
      password, 
      phone,
      role: userRole
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erro ao registrar',
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    const user = await User.findOne({ email })
      .select('+password')
      .populate('registeredEvents')
      .populate('createdEvents');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Email ou senha incorretos' 
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Email ou senha incorretos' 
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        registeredEventsCount: user.registeredEvents.length,
        createdEventsCount: user.createdEvents.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao fazer login',
      error: error.message 
    });
  }
};

// Obter perfil do usuário autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('registeredEvents')
      .populate('createdEvents');

    if (!user) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        registeredEvents: user.registeredEvents,
        createdEvents: user.createdEvents
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao obter perfil',
      error: error.message 
    });
  }
};

module.exports = { register, login, getProfile };
