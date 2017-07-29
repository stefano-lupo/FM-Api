const LocalStrategy   = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

let User = require('../models/User').User;

// expose this function to our app using module.exports
module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      session: false,
      passReqToCallback : true // allows us to pass back the entire request to the callback (below)
    },
    function(req, email, password, done) {

      console.log(`Email: ${email}, password: ${password}`);

      process.nextTick(function() {
        console.log("Starting..");

        User.findOne({'local.email': email}, (err, user) => {
          if(err) {
            console.log(err);
          }

          if(user) {
            console.log("USER FOUND");
            return done(null, false);
          }


          let newUser = new User();
          // set the user's local credentials
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);
          console.log(newUser);

          newUser.save((err) => console.log(err));

          return done(null,newUser);

        });

      });

    }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL
  },

    // Callback function called by FB on login
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({'facebook.id': profile.id}, function(err, user) {
        if(err) {
          console.log(err);
          return done(err);
        }

        if(user) {
          return done(null, user); //return user if found
        } else {
          let newUser = new User();

          // These profile.field names actually come from passport who standardize across different platforms
          // Eg google, fb, twitter etc into one profile object
          console.log(profile);
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          // newUser.email = profile.emails[0].value;

          newUser.save((err) => {
            if(err) {
              throw err;
            }

            return done(null, newUser);
          })
        }



      })
    })
  }
  ));

};