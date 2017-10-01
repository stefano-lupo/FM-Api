export default function(sequelize, Sequelize) {
  const Category = sequelize.define('category', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
    },
    belongsTo: {
      type: Sequelize.UUID
    }
  });

  return Category;
};