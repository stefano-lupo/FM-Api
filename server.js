// Import Modules
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';

// Import Controllers
import UserController from './controllers/UserController';
import CategoryController from './controllers/CategoryController';
import ProviderController from './controllers/ProviderController';
import AccountController from './controllers/AccountController';
import JobController from './controllers/JobController';
import MessageController from './controllers/MessageController';
import config from './config'

const app = express();

Object.keys(config).map(key => {
  app.set(key, config[key]);
});

app.use(bodyParser.urlencoded({extended: true}));   // Parses application/x-www-form-urlencoded for req.body
app.use(bodyParser.json());                         // Parses application/json for req.body
app.use(morgan('dev'));

// Unauthenticated endpoints
app.post('/auth/facebook', AccountController.authWithFacebook);
app.post('/auth/register', (req, res) => AccountController.register(req, res));
// app.post('/auth/login', (req, res) => AccountController.login(req, res));

// Testing
app.post('/providers/test', ProviderController.createTestProvider);
app.get('/providers/test', ProviderController.getTestProvider);


// Authorization Middleware
app.use((req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, app.get('jwtSecret'), (err, decoded) => {
      if(err) {
        console.log("Invalid token supplied");
        return res.status(401).json({message: 'Failed to authenticate token'})
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    console.log("No token provided with request");
    return res.status(401).json({
      message: 'No token provided'
    });
  }
});


// Authenticated endpoints
app.get('/users', (req, res) => UserController.getUsers(req, res));
app.get('/users/me', (req, res) => UserController.getUser(req, res));
app.get('/users/me/jobs', (req, res) => UserController.getUsersJobs(req, res));

app.get('/categories', (req, res) => CategoryController.getCategories(req, res));

app.post('/me/provider', ProviderController.registerMyProvider);
app.get('/me/provider/:id', ProviderController.loginMyProvider);

app.post('/jobs', (req, res) => JobController.requestJob(req, res));
app.post('/jobs/:id/activate', (req, res) => JobController.activateJob(req, res));

app.post('/jobs/:id/messages', (req, res) => MessageController.sendMessage(req, res));
app.get('/jobs/:id/messages', (req, res) => MessageController.getMessages(req, res));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// 404 Middleware
app.use((req, res) => {
  console.log("404 here");
  res.status(404).json({message: "Invalid Resource requested"});
});


// Error Handling middleware
app.use((err, req, res, next) => {
  const { status, message } = err;
  console.log(`Handling error: (${status}) ${message}`);
  res.status(status || 500).json({message});
});



// Initialize the Server
app.listen(3000, function() {
  console.log('Listening on port 3000');
});
