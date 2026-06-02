const Event = require('../models/Event');
const User = require('../models/User');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, capacity, price, tags } = req.body;

    // Valida se todos os campos obrigatórios estão presentes
    if (!title || !description || !date || !location || !category || !capacity) {
      return res.status(400).json({ 
        message: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Cria o evento com o userId do usuário autenticado
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      capacity,
      price,
      tags,
      createdBy: req.userId
    });

    // Adiciona o evento à lista de eventos criados do usuário
    await User.findByIdAndUpdate(req.userId, {
      $push: { createdEvents: event._id }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Evento criado com sucesso',
      event 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erro ao criar evento', 
      error: error.message 
    });
  }
};

const getEvents = async (req, res) => {
  try {
    let query = {};
    
    if (req.query.category) query.category = req.query.category;
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .limit(limit)
      .skip(startIndex)
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      events
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar eventos', 
      error: error.message 
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email phone')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ 
        message: 'Evento não encontrado' 
      });
    }

    res.json({ 
      success: true, 
      event 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar evento', 
      error: error.message 
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        message: 'Evento não encontrado' 
      });
    }

    // Verifica se o usuário é o criador do evento
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Você não tem permissão para modificar este evento' 
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ 
      success: true, 
      message: 'Evento atualizado com sucesso',
      event 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erro ao atualizar evento', 
      error: error.message 
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        message: 'Evento não encontrado' 
      });
    }

    // Verifica se o usuário é o criador do evento
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Você não tem permissão para deletar este evento' 
      });
    }

    await event.deleteOne();

    // Remove o evento da lista de eventos criados do usuário
    await User.findByIdAndUpdate(req.userId, {
      $pull: { createdEvents: event._id }
    });

    res.json({ 
      success: true, 
      message: 'Evento deletado com sucesso' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao deletar evento', 
      error: error.message 
    });
  }
};

// Registrar usuário em um evento (participação)
const registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        message: 'Evento não encontrado' 
      });
    }

    // Verifica se o usuário já está registrado
    if (event.attendees.includes(req.userId)) {
      return res.status(400).json({ 
        message: 'Você já está registrado neste evento' 
      });
    }

    // Verifica se há vagas disponíveis
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ 
        message: 'Evento cheio. Não há mais vagas disponíveis' 
      });
    }

    // Adiciona o usuário aos participantes do evento
    event.attendees.push(req.userId);
    await event.save();

    // Adiciona o evento à lista de eventos do usuário
    await User.findByIdAndUpdate(req.userId, {
      $push: { registeredEvents: event._id }
    });

    res.json({ 
      success: true, 
      message: 'Você foi registrado no evento com sucesso',
      event 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao registrar no evento', 
      error: error.message 
    });
  }
};

// Desregistrar usuário de um evento
const unregisterEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        message: 'Evento não encontrado' 
      });
    }

    // Verifica se o usuário está registrado
    if (!event.attendees.includes(req.userId)) {
      return res.status(400).json({ 
        message: 'Você não está registrado neste evento' 
      });
    }

    // Remove o usuário dos participantes do evento
    event.attendees.pull(req.userId);
    await event.save();

    // Remove o evento da lista de eventos do usuário
    await User.findByIdAndUpdate(req.userId, {
      $pull: { registeredEvents: event._id }
    });

    res.json({ 
      success: true, 
      message: 'Você foi desregistrado do evento' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao desregistrar do evento', 
      error: error.message 
    });
  }
};

// Listar eventos que o usuário criou
const getMyCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.userId })
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar seus eventos', 
      error: error.message 
    });
  }
};

// Listar eventos que o usuário está participando
const getMyRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'registeredEvents',
        populate: { path: 'createdBy', select: 'name email' }
      });

    res.json({
      success: true,
      count: user.registeredEvents.length,
      events: user.registeredEvents
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar seus eventos', 
      error: error.message 
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerEvent,
  unregisterEvent,
  getMyCreatedEvents,
  getMyRegisteredEvents
};