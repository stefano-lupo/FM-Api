let mongoose = require('mongoose');

// Define fields
let jobSchema = mongoose.Schema({
  title: String,
  description: String,
  user: Schema.Types.ObjectId,
  provider: Schema.Types.ObjectId,
  requestData: Date,
  startDate: Date,
  completionDate: Date,
  status: String,
  category: String,
  review: Array,
});

// Compile schema into model BEFORE exporting
let Job = mongoose.model('Job', jobSchema);

module.exports = {
  Job
};