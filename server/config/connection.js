const mongoose = require('mongoose');

mongoose.connect(
  // mongodb://localhost/<your db name here>
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/the-lore-keeper',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
