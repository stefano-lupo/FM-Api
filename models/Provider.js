let mongoose = require('mongoose');

// Define fields
let providerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  category: String,
  thumbnail: String,
  score: Number
});

// Compile schema into model BEFORE compilation
let Provider = mongoose.model('Provider', providerSchema);

module.exports = {
  Provider
};