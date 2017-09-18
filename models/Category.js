let mongoose = require('mongoose');

// Define fields
let categorySchema = mongoose.Schema({
  category: String,
  subCategories: Array,
});

// Compile schema into model BEFORE compilation
let Category = mongoose.model('Category', categorySchema);

module.exports = {
  Category
};