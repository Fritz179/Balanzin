const mongoose = require('mongoose')

const weeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  move: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Wwe_Game', weeSchema, 'Wwe_Game')
