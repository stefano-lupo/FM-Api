let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

// Define fields
let accountSchema = mongoose.Schema({
  firstName: String,      // Probably delete as contained in USer
  lastName: String,       // same
  email: String,
  password: String,
  createdOn: Date,
  lastLogIn: Date,
  facebook: {
    id: String,
  },
  providers: Array,
  user: mongoose.Schema.ObjectId
});

// Define methods
accountSchema.methods.generateHash = function (password) {
  console.log("hashing password");
  return bcrypt.hashSync(password, null);
};

accountSchema.methods.isValidPassword = function (password) {
  console.log("checking password");
  return bcrypt.compareSync(password, this.password)
};

// Compile schema into model BEFORE compilation
let Account = mongoose.model('Account', accountSchema);

module.exports = {
  Account
};