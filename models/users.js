/* eslint-disable import/no-extraneous-dependencies */

const { Model } = require('sequelize');
const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate() {
      // define association here
    }
  }

  Users.init({
    id: {
      type: DataTypes.STRING(21), // You can adjust the length based on your needs
      primaryKey: true,
      defaultValue: () => nanoid(11),
    },
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
