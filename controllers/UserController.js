import jwt from 'jsonwebtoken';

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
        validToken(res, response.user_id, fbAccessToken);
      } else {
        invalidToken(res);
      }
    })
    .catch((error) => console.log(error));
};

function validToken(res, fbUserID, fbAccessToken) {
  console.log("Valid Token Found");

  User.findOne({ facebook: {id: fbUserID} }, (err, user) => {
    if(err) {
      console.log(err);
      return;
    }
    if(user) {
      console.log('user found');
      let authToken = jwt.sign(user, process.env.JWT_SECRET);
      res.send({
        message: "Succesfully Logged in",
        isLoggedIn: true,
        authToken,
        user
      });
    } else {
      fetch(`https://graph.facebook.com/v2.10/me?fields=first_name%2Clast_name%2Cemail&access_token=${fbAccessToken}`)
      .then(response => {
        return response.json()
      })
      .then(response => {
        const firstName = response.first_name;
        const lastName = response.last_name;
        const email = response.email;
        console.log("Creating user");
        User.create({
          firstName,
          lastName,
          email,
          facebook: {
            id: fbUserID
          }
        }, (err, user) => {
          if(err) {
            console.log(err);
          } else {
            console.log("Sending created user");
            let authToken = jwt.sign(user, process.env.JWT_SECRET);
            res.send({
              message: "Succesfully Logged in",
              isLoggedIn: true,
              authToken,
              user
            });
          }
        });
      })
    }
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
  authWithFacebook,
  getUsers,
  getUser,
  createNewUser
};

const genericResponse = (message = "An error has occurred") => {
  return {message};
};