const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: [{
    name: String,
    description: String
  }],
  tags: {
    type: Array,
    default: [],
  },
  nestedDocuments: [{
    name: String
  }]
})

const Category = model('Category', categorySchema);

module.exports = Category;
