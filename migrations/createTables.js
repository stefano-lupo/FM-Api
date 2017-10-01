import db from '../models/';

const Account = db.account;
const Provider = db.provider;
const Category = db.category;

/*
  This script creates/re-creates all tables for the models
 */

const { sequelize } = db;

const categories = [
  {name: 'Beauty'},
  {name: 'Make Up', belongsTo: 1},
  {name: 'Hair', belongsTo: 1},

  {name: 'Home and Gardening'},
  {name: 'Landscaping', belongsTo: 4},

  {name: 'Education'},
  {name: 'Grinds', belongsTo: 6},

  {name: 'Health and Fitness'},
  {name: 'Personal Trainer', belongsTo: 8}
];

const resetDB = async () => {
  await sequelize.sync({force: true});
  await Category.bulkCreate(categories);

  process.exit();
};

resetDB();

// insert into providers (name, category, description, images, accountId) values ("Lupo Web Design", "God knows", "Great websites", "['https://openclipart.org/download/17810/lemmling-Cartoon-elephant.svg']", '367ba130-a5f2-11e7-aade-4facb294fd47');