// Import Modules
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
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


// Initialize the Server
app.listen(3000, function() {
  console.log('Listening on port 3000');
});

// Register middleware
// NOTE: Must be done before CRUD handlers
app.use(bodyParser.urlencoded({extended: true}));



// Define Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/');
});

app.post('/user', (req, res) => UserController.createNewUser(req, res));
app.get('/users', (req, res) => UserController.getUsers(req, res));
app.get('/categories', (req, res) => CategoryController.getCategories(req, res));
app.get('/providers/:category', (req, res) => ProviderController.getProvidersByCategory(req, res));