let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

// Define fields
let userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  jobs: {
    active: Array,
    completed: Array
  },
  reviews: Array,
  rating: Number,
});

// Compile schema into model BEFORE compilation
let User = mongoose.model('User', userSchema);

module.exports = {
  User
};