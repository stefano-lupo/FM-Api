// Import Models
let User = require('../models/User').User;

// Initialize .env
require('dotenv').config();

let fetch = require("node-fetch")

/**
 * POST /auth/facebook
 * Validate user with their facebook token
 */
const authWithFacebook = (req, res) => {
  const { fbAccessToken } = req.body;
  const url = `https://graph.facebook.com/v2.10/debug_token?input_token=${fbAccessToken}&access_token=${process.env.FB_APP_ID}|${process.env.FB_SECRET}`;
  console.log(url);

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
    response = response.data;
      if (response.is_valid && response.app_id === process.env.FB_APP_ID) {
        validToken(res, response.user_id);
      } else {
        invalidToken(res);
      }
    })
    .catch((error) => console.log(error));
}

function validToken(res, fbUserID) {
  console.log("Valid User Found");
  res.send({
    message: "Succesfully Logged in",
    isLoggedIn: true,
    authToken: '12345'
  });
}

function invalidToken(res) {
  console.log("Invalid user")
  res.send({
    message: "Failed To Log In",
    isLoggedIn: false,
  });
}


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
  authWithFacebook,
  getUsers,
  createNewUser
};

const genericResponse = (message = "An error has occurred") => {
  return {message};
};