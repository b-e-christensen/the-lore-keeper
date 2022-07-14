const { Schema, model } = require('mongoose');
const Category = require('./Category');

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  categories: { type: Array, ref: Category }
})

const File = model('File', fileSchema);

module.exports = File;
