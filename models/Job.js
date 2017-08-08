let mongoose = require('mongoose');

// Define fields
let jobSchema = mongoose.Schema({
  title: String,
  description: String,
  userID: mongoose.Schema.ObjectId,
  providerID: mongoose.Schema.ObjectId,
  requestDate: Date,
  startDate: Date,
  completionDate: Date,
  status: String,
  category: String,
  review: Object,
});


// Compile schema into model BEFORE exporting
let Job = mongoose.model('Job', jobSchema);

module.exports = {
  Job
};