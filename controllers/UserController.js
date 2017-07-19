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
  User.findOne({email:user.email}, (err, foundUser) => {
    if(foundUser){
      console.log(`${foundUser.firstName} ${foundUser.lastName} already exists`);
      res.status(409).json(genericResponse());
    } else {
      user.save(user, function(err){
        if(err) return console.log(err);
      });
      console.log(`Saving ${user}`);
      res.json(genericResponse("User successfully created"));
    }
  })
};

module.exports = {
  getUsers,
  createNewUser
};

const genericResponse = (message = "An error has occurred") => {
  return {message};
};