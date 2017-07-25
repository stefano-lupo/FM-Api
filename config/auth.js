// Initialize .env
require('dotenv').config();

module.exports = {
  'facebookAuth': {
    'clientID': process.env.FB_APP_ID,
    'clientSecret': process.env.FB_SECRET,
    'callbackURL': process.env.FB_CALLBACK_URL
  },
};