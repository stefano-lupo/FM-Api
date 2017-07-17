// Import Models
let User = require('../models/User').User;

const getUsers = function(req, res) {
  User.find(function(err, users) {
    if(err) return console.log(err);
    console.log("Sending users");
    res.send(users);
  })
};

module.exports = {
  getUsers
};