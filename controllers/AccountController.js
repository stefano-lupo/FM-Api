import jwt from 'jsonwebtoken';

// Import Models
let Account = require('../models/Account').Account;

// Initialize .env
require('dotenv').config();

let fetch = require("node-fetch")

/**
 * POST /auth/register
 * Register a new user if one doesn't already exist
 */
const register = (req, res) => {
  const { email } = req.body.registerForm;
  Account.findOne({email: email}, (err, account) => {
    if(account) {
      console.log(`${account.email}:  account already exists`);
      res.status(409).json({message: `${account.email}:  account already exists`});
    } else {
      const {firstName, lastName, password} = req.body.registerForm;

      let newAccount = new Account({firstName, lastName, email});
      newAccount.password = newAccount.generateHash(password);

      console.log(newAccount);
      newAccount.save((err) => {
        if(err) {
          console.log(err);
          res.send({message: "An error has occured"});
        } else {
          login({email, password}, res);
        }
      });
    }
  })
};

function login(req, res) {
  console.log("about to login");
  const { email, password } = req;

  Account.findOne({ email }, (err, account) => {
    if(err) {
      console.log(err);
      return res.status(403).json({message: `Unrecognised Email`});
    }

    if(!account.isValidPassword(password)) {
      console.log("incorrect password");
      return res.status(403).json({message: `Incorrect Password`});
    }

    let accountAuthToken = jwt.sign(account, process.env.JWT_SECRET);
    res.send({
      success: true,
      message: "Succesfully Logged in",
      account,
      accountAuthToken,
    });
  });
}


module.exports = {
  register,
};
