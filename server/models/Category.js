const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  // name: guilds
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // content: reference of  ---> crafting guild, mining guild, etc.
  content: { type: Array, ref: Content },
  // user creates schema FOR ALL GUILDS, we pull that when user wants to make another Content for this category.
  contentSchema: {
    type: Object,
    default: {}
  }
})

const Category = model('Category', categorySchema);

module.exports = Category;
