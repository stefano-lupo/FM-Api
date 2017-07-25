let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

// Define fields
let userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
  },
});

// Define methods
userSchema.methods.generateHash = function (password) {
  console.log("hashing password");
  return bcrypt.hashSync(password, null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

// Compile schema into model BEFORE compilation
let User = mongoose.model('User', userSchema);

module.exports = {
  User
};