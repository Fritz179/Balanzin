const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  scripts: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('Projects', projectSchema, 'Projects')
