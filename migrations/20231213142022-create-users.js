/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING(21), // Ubah tipe kolom id menjadi STRING dengan panjang 21
        primaryKey: true,
        allowNull: false,
        defaultValue: () => nanoid(11), // Gunakan nanoid sebagai nilai default dengan fungsi
      },
      usernames: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      telephone: {
        type: Sequelize.BIGINT(50),
      },
      picture: {
        type: Sequelize.STRING(255),
        defaultValue: 'https://i.ibb.co/qntfy8V/kitten.png',
      },
      role: {
        type: Sequelize.STRING(50),
        defaultValue: 'user',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  ),
  down: (queryInterface) => (
    queryInterface.dropTable('Users')
  ),
};
