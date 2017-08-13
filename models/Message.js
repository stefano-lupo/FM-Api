let mongoose = require('mongoose');

// Define fields
let messageSchema = mongoose.Schema({
  text: String,
  from: mongoose.Schema.ObjectId,
  to: mongoose.Schema.ObjectId,
  sentDate: Date,
  seenDate: Date,
});


// Compile schema into model BEFORE exporting
let Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message
};