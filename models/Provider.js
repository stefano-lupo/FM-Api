let mongoose = require('mongoose');

// Define fields
let providerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  category: String,
  description: String,
  images: Array,
  thumbnail: String,
  reviews: Array,
});

// Compile schema into model BEFORE compilation
let Provider = mongoose.model('Provider', providerSchema);

module.exports = {
  Provider
};