import jwt from 'jsonwebtoken';

// Import Models
const Account = require('../models/Account').Account;
const User = require('../models/User').User;

// Initialize .env
require('dotenv').config();

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

      const user = new User({firstName, lastName, rating: 50});
      user.save((err) => {
        if(err) {
          return res.status(500).json({message: `Error creating account : ${email}`});
        }

        newAccount.user = user._id;
        console.log(newAccount);
        newAccount.save((err) => {
          if(err) {
            console.log(err);
            res.send({message: "An error has occured"});
          } else {
            login({email, password}, res);
          }
        });
      });
    }
  })
};


/**
 * POST /auth/login
 * attempts to login a user with the given email and password
 */
const login = (req, res) => {
  const { email, password } = req.body || req;  // hack here so that this can be called from above
  console.log(`about to login with ${email}`);

  Account.findOne({ email }, (err, account) => {
    if(err || !account) {
      console.log(`error: ${err}`);
      return res.status(403).json({message: `Unrecognised Email`});
    }

    if(!account.isValidPassword(password)) {
      console.log("incorrect password");
      return res.status(403).json({message: `Incorrect Password`});
    }

    // Valid account, generate token
    const accountAuthToken = jwt.sign(account.toObject(), process.env.JWT_SECRET);

    User.findOne({_id: account.user}, (err, user) => {
      if(err) {
        console.log(err);
        return res.status(500).send("Error no user to match accounts userId");
      }
      const userAuthToken = jwt.sign(user.toObject(), process.env.JWT_SECRET);
      return res.send({
        success: true,
        message: "Succesfully Logged in",
        account: {
          accountAuthToken,
          providers: account.providers,
          email: account.email,
        },
        user: {
          ...user.toObject(),   // to not include mongoose models inner data
          userAuthToken,
          jobs: user.getJobs()
        },
      });
    });
  });
};



let fetch = require("node-fetch");

/**
 * POST /auth/facebook
 * Validate user with their facebook token
 */
const authWithFacebook = (req, res) => {
  const { fbAccessToken } = req.body;
  const url = `https://graph.facebook.com/v2.10/debug_token?input_token=${fbAccessToken}&access_token=${process.env.FB_APP_ID}|${process.env.FB_SECRET}`;
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

  Account.findOne({facebook: {id: fbUserID}}, async (err, account) => {
    if (err) {
      console.log(`err ${err}`);
      return err;
    }

    if (!account) {
      // Create said account
      fetch(`https://graph.facebook.com/v2.10/me?fields=first_name%2Clast_name%2Cemail&access_token=${fbAccessToken}`)
        .then(response => {
          return response.json()
        })
        .then(response => {
          const firstName = response.first_name;
          const lastName = response.last_name;
          const email = response.email;

          // Create the new user associated with the account
          const user = new User({firstName, lastName, rating: 50});
          user.save(err => {
            if (err) {
              return console.log(err);
            }

            console.log("No account, Saved user");
            account = new Account({
              firstName,
              lastName,
              email,
              user: user._id,
              facebook: {
                id: fbUserID
              }
            });

            account.save((err) => {
              if(err) console.log(err);
              const accountAuthToken = jwt.sign(account.toObject(), process.env.JWT_SECRET);
              const userAuthToken = jwt.sign(user.toObject(), process.env.JWT_SECRET);
              console.log("Sending new acc/user");
              console.log(account);
              return res.send({
                success: true,
                message: "Succesfully Logged in",
                account: {
                  accountAuthToken,
                  providers: account.providers,
                  email: account.email,
                },
                user: {
                  ...user.toObject(),   // to not include mongoose models inner data
                  userAuthToken,
                },
              });
            });
          });
        });
    } else {
      User.findOne({_id: account.user}, async (err, user) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error no user to match accounts userId");
        }
        const accountAuthToken = jwt.sign(account.toObject(), process.env.JWT_SECRET);
        const userAuthToken = jwt.sign(user.toObject(), process.env.JWT_SECRET);
        const jobs = await user.getJobs()
        console.log("jobs are");
        console.log(jobs);
        return res.send({
          success: true,
          message: "Succesfully Logged in",
          account: {
            accountAuthToken,
            providers: account.providers,
            email: account.email,
          },
          user: {
            ...user.toObject(),   // to not include mongoose models inner data
            userAuthToken,
            jobs
          },
        });
      });
    }
  });
}


function invalidToken(res) {
  console.log("Invalid user");
  res.send({
    message: "Failed To Log In",
    isLoggedIn: false,
  });
}



module.exports = {
  register,
  login,
  authWithFacebook
};
