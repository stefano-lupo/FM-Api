// Import Modules
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
const app = express();


// Import Controllers
import UserController from './controllers/UserController';

// Initialize Server
mongoose.connect('mongodb://localhost/nodeServerDB');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Database");
  app.listen(3000, function() {
    console.log('Listening on port 3000');
  })
});


// Register middleware
// NOTE: Must be done before CRUD handlers
app.use(bodyParser.urlencoded({extended: true}));



// Define Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/');
});

// Create a new user
app.post('/user', (req, res) => {
  db.collection('users').save(req.body, (err, result) => {
    if (err) { return console.log(err); }

    console.log('Saved to database: ', result);
    res.redirect('/');
  })
});

app.get('/users', (req,res) => UserController.getUsers(req, res));
