const mongoose = require('mongoose')

const weeSchema = mongoose.Schema({
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

module.exports = mongoose.model('Wee_Card', weeSchema, 'Wee_Card')
