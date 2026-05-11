const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título do evento é obrigatório'],
    trim: true,
    minlength: [3, 'Título deve ter pelo menos 3 caracteres'],
    maxlength: [100, 'Título deve ter no máximo 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    minlength: [10, 'Descrição deve ter pelo menos 10 caracteres'],
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres']
  },
  date: {
    type: number,
    required: [true, 'Data do evento é obrigatória'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'A data do evento deve ser futura'
    }
  },
  location: {
    type: String,
    required: [true, 'Localização é obrigatória'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacidade é obrigatória'],
    min: [1, 'Capacidade deve ser pelo menos 1'],
    max: [10000, 'Capacidade máxima é 10000']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Preço não pode ser negativo']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);