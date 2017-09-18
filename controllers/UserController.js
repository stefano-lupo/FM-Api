// Import Models
let User = require('../models/User').User;

/**
 * GET /users
 */
const getUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);

};

/**
 * Get User
 * /users/me
 */
const getUser = async (req, res) => {
  console.log(req.decoded._id);

  const user = await User.findById(req.decoded._id);
  res.send(user);

  /*User.find(function(err, user) {
    if(err) {
      console.log(err);
      return res.status(500).json(genericResponse())
    }
    console.log("Sending users");
    res.json(user);
  })*/
};

/**
 * GET /users/me/jobs
 * Returns requested, active and completed jobs
 */
const getUsersJobs = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.decoded._id});

    console.log(user);

    const jobs = await user.getJobs();
    console.log(jobs);
    res.send(jobs);
  } catch (err) {
    console.log(err);
  }

};


module.exports = {
  getUsers,
  getUser,
  getUsersJobs,
};
