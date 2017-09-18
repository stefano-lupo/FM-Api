import bcrypt from 'bcrypt-nodejs';

export default function(sequelize, Sequelize) {
  const Account = sequelize.define('account', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      validate: {isEmail: true}
    },
    password: {
      type: Sequelize.STRING,
      set(password) {
        console.log("Hashing and setting password");
        this.setDataValue('password', bcrypt.hashSync(password, null))
      }
    },
    facebookId: Sequelize.STRING
  },
  {
    util: {
      isValidPassword(password) {
        console.log(`checking ${password} against ${this.getDataValue('password')}`);
        return bcrypt.compareSync(password, this.getDataValue('password'))
      }
    }
  });
  Account.associate = (models) => {
    Account.hasMany(models.provider);
  };
  return Account;
};
