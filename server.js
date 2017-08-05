// Import Modules
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
const app = express();

// Initialize .env
require('dotenv').config();

// Import Controllers
import UserController from './controllers/UserController';
import CategoryController from './controllers/CategoryController';
import ProviderController from './controllers/ProviderController';
import AccountController from './controllers/AccountController';

// Initialize the DB
mongoose.connect(process.env.DB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Database");
});


/* Passport stuff
import passport from 'passport';
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.post('/user', passport.authenticate('local-signup'));
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends', 'email']}));
app.get('/auth/facebook/callback', passport.authenticate('facebook'));*/



// Register middleware (Must be done before CRUD handlers)
app.use(bodyParser.urlencoded({extended: true}));   // Parses application/x-www-form-urlencoded for req.body
app.use(bodyParser.json());                         // Parses application/json for req.body
app.use(morgan('dev'));

// expose environment variables to app
app.set('jwtSecret', process.env.JWT_SECRET);




// Unauthenticated endpoints
app.post('/auth/facebook', (req, res) => UserController.authWithFacebook(req, res));
app.post('/auth/register', (req, res) => AccountController.register(req, res));


// Authorization Middleware
app.use(function(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, app.get('jwtSecret'), (err, decoded) => {
      if(err) {
        return res.json({authenticated: false, message: 'Failed to authenticate token'})
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send({
      authenticated: false,
      message: 'No token provided'
    });
  }
});

// Authenticated endpoints
app.get('/users', (req, res) => UserController.getUsers(req, res));
app.get('/users/me', (req, res) => UserController.getUser(req, res));
app.get('/categories', (req, res) => CategoryController.getCategories(req, res));
app.get('/providers/:category', (req, res) => ProviderController.getProvidersByCategory(req, res));


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



// Initialize the Server
app.listen(3000, function() {
  console.log('Listening on port 3000');
});
