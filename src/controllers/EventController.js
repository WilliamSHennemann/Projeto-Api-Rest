const Event = require('../models/Event');

// @desc    Criar evento
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    // Erros de validação do Mongoose serão capturados aqui
    res.status(400).json({ 
      message: 'Erro ao criar evento', 
      error: error.message 
    });
  }
};

// @desc    Listar eventos com filtros e paginação
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
    res.status(500).json({ message: 'Erro ao listar eventos', error: error.message });
  }
};

// @desc    Obter evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar evento', error: error.message });
  }
};

// @desc    Atualizar evento
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, event });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar evento', error: error.message });
  }
};

// @desc    Deletar evento
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    await event.deleteOne();
    res.json({ success: true, message: 'Evento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar evento', error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};