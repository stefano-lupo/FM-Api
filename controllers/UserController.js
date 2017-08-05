// Import Models
let User = require('../models/User').User;

/**
 * GET /users
 */
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

/**
 * Get User
 * /users/me
 */
const getUser = function(req, res) {
  console.log(req.decoded);
  User.find(function(err, user) {
    if(err) {
      console.log(err);
      return res.status(500).json(genericResponse())
    }
    console.log("Sending users");
    res.json(user);
  })
};


/**
 * POST /user
 * Create a new user if user doesn't already exist
 */
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
  getUser,
  createNewUser
};

const genericResponse = (message = "An error has occurred") => {
  return {message};
};