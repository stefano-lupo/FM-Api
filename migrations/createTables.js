import db from '../models/';

const Account = db.account;
const Provider = db.provider;

/*
  This script creates/re-creates all tables for the models
 */

const { sequelize } = db;
sequelize.sync({force: true}).then(() => {
  process.exit();
});

// insert into providers (name, category, description, images, accountId) values ("Lupo Web Design", "God knows", "Great websites", "['https://openclipart.org/download/17810/lemmling-Cartoon-elephant.svg']", '367ba130-a5f2-11e7-aade-4facb294fd47');