let Provider = require('../models/Provider').Provider;

const getProvidersByCategory = function(req, res) {
  const category = req.query.category;
  console.log(`Searching by: ${category}`);
  Provider.find({ category }, (err, providers) => {
    if(err) {
      console.log(err);
      return res.status(500).json(genericResponse());
    }
    console.log("Sending categories");
    res.json(providers);
  })
};

module.exports = {
  getProvidersByCategory
};
