let mongoose = require('mongoose');
let Job = require('../models/Job').Job;

// Define fields
let userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  jobs: {
    active: Array,
    completed: Array,
    requested: Array,
  },
  reviews: Array,
  rating: Number,
});

userSchema.methods.getJobs = async function() {
  console.log(`Getting Jobs for ${this._id}`);
  const allJobs = await Job.find({userID : this._id}).select('-messages');

  let requested = [], active = [], completed = [];

  allJobs.map(job => {
    if(job.status === 'requested') {
      requested.push(job);
    } else if(job.status === 'active') {
      active.push(job);
    } else {
      completed.push(job);
    }
  });

  return {requested, active, completed};
};


// Compile schema into model BEFORE compilation
let User = mongoose.model('User', userSchema);

module.exports = {
  User
};