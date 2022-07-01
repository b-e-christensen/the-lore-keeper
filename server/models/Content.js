const { Schema, model } = require('mongoose');

const contentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: Array,
    default: []
  },
  tags: {
    type: Array,
    default: [],
  }
})

const Content = model('Content', contentSchema);

module.exports = Content;