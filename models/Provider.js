export default function(sequelize, Sequelize) {
  const Provider = sequelize.define('provider', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    images: Sequelize.JSON,
  });

  Provider.associate = (models) => {
    Provider.belongsTo(models.account);
  };

  return Provider;
};


















let mongoose = require('mongoose');

// Define fields
let providerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  category: String,
  description: String,
  images: Array,
  thumbnail: String,
  reviews: Array,
});

// Compile schema into model BEFORE compilation
let Provider = mongoose.model('Provider', providerSchema);

module.exports = {
  Provider
};