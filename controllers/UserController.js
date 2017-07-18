// Import Models
let User = require('../models/User').User;

const getUsers = function(req, res) {
  User.find(function(err, users) {
    if(err) {
      console.log(err);
      return res.status(500).json(genericResponse())
    }
    console.log("Sending users");
    res.json(users);
  })
};

const createNewUser = (req, res) => {
  let user = new User(req.body);
  User.findOne({email:user.email}, (err, user) => {
    if(user){
      console.log(`${user.firstName} ${user.lastName} already exists`);
      res.status(409).json(genericResponse());
    } else {
      User.create(user, function(err){
        if(err) return console.log(err);
      });
      res.json(genericResponse(true, "User successfully created"));
    }
  })
};

module.exports = {
  getUsers,
  createNewUser
};

const genericResponse = (success = false, message = "An error has occurred") => {
  return {success, message};
};