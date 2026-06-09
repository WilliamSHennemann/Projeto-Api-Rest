const Event = require('../models/Event');

// Middleware para verificar se o usuário é o criador do evento
const isEventOwner = async (req, res, next) => {
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
        message: 'Você não tem permissão para modificar este evento' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao verificar permissão',
      error: error.message 
    });
  }
};

module.exports = isEventOwner;
