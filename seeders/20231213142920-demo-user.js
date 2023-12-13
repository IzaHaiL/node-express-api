'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add seed commands here
    await queryInterface.bulkInsert('users', [
      {
        usernames: 'default_user',
        email: 'default_user@example.com',
        password: 'hashed_password', // Replace with the hashed password
        telephone: 1234567890,
        picture: 'default_picture_url',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more default users if needed
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Remove seed commands here
    await queryInterface.bulkDelete('users', null, {});
  }
};
