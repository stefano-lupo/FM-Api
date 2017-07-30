let mongoose = require('mongoose');

// Define fields
let jobSchema = mongoose.Schema({
  user: Schema.Types.ObjectId,
  provider: Schema.Types.ObjectId,
  startDate: Date,
  status: String,
  category: String,
  review: Array,
});

// Compile schema into model BEFORE exporting
let Job = mongoose.model('Job', jobSchema);

module.exports = {
  Job
};