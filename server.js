// Import Modules
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
const app = express();

// Initialize .env
require('dotenv').config();

// Import Controllers
import UserController from './controllers/UserController';
import CategoryController from './controllers/CategoryController';
import ProviderController from './controllers/ProviderController';

// Initialize the DB
mongoose.connect(process.env.DB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Database");
});

require('./config/passport')(passport);



// Register middleware (Must be done before CRUD handlers)
app.use(bodyParser.urlencoded({extended: true}));   // Parses application/x-www-form-urlencoded for req.body
app.use(bodyParser.json());                         // Parses application/json for req.body
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());




// Define Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/');
});

// Local routes
app.post('/user', passport.authenticate('local-signup'));
app.get('/users', (req, res) => UserController.getUsers(req, res));
app.get('/categories', (req, res) => CategoryController.getCategories(req, res));
app.get('/providers/:category', (req, res) => ProviderController.getProvidersByCategory(req, res));

// FB routes - scope defines extra stuff we request from FB
app.post('/auth/facebook', (req, res) => UserController.authWithFacebook(req, res));
// app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends', 'email']}));
// app.get('/auth/facebook/callback', passport.authenticate('facebook'));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})





// Initialize the Server
app.listen(3000, function() {
  console.log('Listening on port 3000');
});


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.status(403).send('You are unauthorized to view this');
}