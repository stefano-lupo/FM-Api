import moment from 'moment';

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
    requestDate: moment(),
    status: 'requested',
  });

  job.save(err => {
    if(err) {
      console.log(`error saving job: ${err}`);
      return res.send("Error occured saving job");
    }
    console.log(job);

    const jobID = job._id;
    User.update({_id: userID}, { $push: { 'jobs.requested': jobID } }, (err, user) => {
      if(err) {
        console.log("error occured saving requested job to user");
        return res.send("Error occured saving requested job to user");
      }

      return res.send(job);
    });
  });
};


/**
 * POST /jobs/:id/activate
 * Makes job active (accepts job request - done by provider)
 */

const activateJob = async (req, res) => {
  // const userID = req.decoded._id;
  const jobID = req.params.id;
  console.log(jobID);

  const job = await Job.findOneAndUpdate({_id: jobID}, {$set: {status: 'active', startDate: moment()} });

  res.send(job);
};


module.exports = {
  requestJob,
  activateJob
};