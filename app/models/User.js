const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  wwe: {
    required: true,
    type: {},
    default: {
      score: 0
    }
  }
})

module.exports = mongoose.model('Users', userSchema, 'Users')
