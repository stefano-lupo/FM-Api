export default function(sequelize, Sequelize) {
  const Category = sequelize.define('category', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    belongsTo: {
      type: Sequelize.INTEGER,
      defaultValue: null,
    }
  });

  return Category;
};