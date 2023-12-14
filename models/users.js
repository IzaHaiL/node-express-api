const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate() {
      // define association here
    }
  }

  Users.init({
    usernames: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    password: DataTypes.STRING(255),
    telephone: DataTypes.BIGINT(50),
    picture: DataTypes.STRING(255),
    role: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'users',
  });

  return Users;
};
