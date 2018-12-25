const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  redirect: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Cards', cardSchema, 'Cards')
