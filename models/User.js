let mongoose = require('mongoose');

// Define fields
let userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
});

// Define methods
userSchema.methods.sayHello = function () {
  let greeting = this.firstName
    ? "Meow name is " + this.firstName
    : "I don't have a name";
  console.log(greeting);
};

// Compile schema into model BEFORE compilation
let User = mongoose.model('User', userSchema);

module.exports = {
  User
};