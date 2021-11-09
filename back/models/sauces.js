const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, },
  description: { type: String},
  imageUrl: { type: String, required: true },
  mainPepper: { type: String },
  heat: { type: Number },
});

module.exports = mongoose.model('Sauce', sauceSchema);