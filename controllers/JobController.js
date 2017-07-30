// Import Models
let User = require('../models/User').User;
let Provider = require('../models/Provider').Provider;
let Job = require('../models/Job');

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


module.exports = {
  authWithFacebook,
  getUsers,
  createNewUser
};

const genericResponse = (message = "An error has occurred") => {
  return {message};
};