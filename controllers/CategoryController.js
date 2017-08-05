let Category = require('../models/Category').Category;

const getCategories = function(req, res) {
  Category.find(function(err, categories) {
    console.log(err);
    console.log(categories);
    if(err) {
      console.log(err);
      return res.status(500).send("ERROR occured with categories");
    }
    console.log("Sending categories");
    res.json(categories);
  })
};

module.exports = {
  getCategories
};
