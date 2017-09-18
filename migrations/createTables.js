import db from '../models';


const { sequelize } = db;
sequelize.sync({force: true}).then(() => {
  process.exit();
});

