const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb://localhost/nodeServerDB', (err, database) => {
  if(err) {
    return console.log(err);
  }

  db = database;
  app.listen(3000, function() {
    console.log('Listening on port 3000');
  })
});

// Register middleware
// NOTE: Must be done before CRUD handlers
app.use(bodyParser.urlencoded({extended: true}));


// Routes
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

// Get users
app.get('/users', (req, res) => {
  db.collection('users').find().toArray(function(err, results) {
    res.send(results);
  })
});
