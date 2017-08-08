// Import Models
let User = require('../models/User').User;
let Provider = require('../models/Provider').Provider;
let Job = require('../models/Job').Job;

// Initialize .env
require('dotenv').config();

let fetch = require("node-fetch")

/**
 * POST /jobs
 * Create a new job request
 */

const requestJob = (req, res) => {
  const userID = req.decoded._id;
  const jobRequest = req.body;

  const job = new Job({
    ...jobRequest,
    userID,
    requestDate: new Date(),
    status: 'requested',
  });

  job.save(err => {
    if(err) {
      console.log(`error saving job: ${err}`);
      return res.send("Error occured saving job");
    }
    console.log(job);
    return res.send(job);

  });
};


module.exports = {
  requestJob
};