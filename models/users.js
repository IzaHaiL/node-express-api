'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    usernames: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    password: DataTypes.STRING(255),
    telephone: DataTypes.BIGINT(50),
    picture: DataTypes.STRING(255),
    role: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};