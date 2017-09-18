let Provider = require('../models/Provider').Provider;

const getProvidersByCategory = function(req, res) {
  const category = req.query.category;
  Provider.find({ category }, null, {sort: {score: -1}}, (err, providers) => {
    if(err) {
      console.log(err);
      return res.status(500).json(genericResponse());
    }
    console.log(`Sending providers by ${category}, found ${providers.length}`);
    res.json(providers);
  })
};

module.exports = {
  getProvidersByCategory
};
