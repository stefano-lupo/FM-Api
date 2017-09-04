let bcrypt = require('bcrypt-nodejs');

export default function(sequelize, Sequelize) {
  return sequelize.define('account', {
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
};

// // Define methods
// accountSchema.methods.generateHash = function (password) {
//   console.log("hashing password");
//   return bcrypt.hashSync(password, null);
// };
//
// accountSchema.methods.isValidPassword = function (password) {
//   console.log("checking password");
//   return bcrypt.compareSync(password, this.password)
// };
//
// // Compile schema into model BEFORE compilation
// let Account = mongoose.model('Account', accountSchema);
//
// module.exports = {
//   Account
// };