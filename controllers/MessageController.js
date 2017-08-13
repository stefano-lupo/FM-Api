import moment from 'moment';

// Import Models
let User = require('../models/User').User;
let Provider = require('../models/Provider').Provider;
let Job = require('../models/Job').Job;
let Message = require('../models/Message').Message;

// Initialize .env
require('dotenv').config();

/**
 * POST /jobs/:id/messages
 * Send a new message
 */

const sendMessage = async (req, res) => {
  const jobID = req.params.id;
  const sentMessage = req.body;

  const message = new Message(sentMessage);

  try {
    const job = await Job.findOne({_id: jobID});
    if(!job) {
      console.log("An error occurred - no job found for that message")
      return res.send("An error occurred - No job found for that message");
    }
    job.messages.push(message);
    await job.save();
    res.send(job.messages);
  } catch (err) {
    res.send(err);
  }
};


/**
 * Get /jobs/:id/messages
 * Gets messages associated with a job
 */

const getMessages = async (req, res) => {
  const jobID = req.params.id;
  try {
    const messages = await Job.findOne({_id: jobID}).select('messages');
    if(!messages) {
      console.log("An error occurred - no job found for that message");
      return res.send("An error occurred - No job found for that message");
    }
    res.send(messages);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};



module.exports = {
  sendMessage,
  getMessages
};