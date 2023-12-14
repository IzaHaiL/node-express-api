const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('admin', 10);

    await queryInterface.bulkInsert('users', [
      {
        usernames: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        telephone: 1234567890,
        picture: 'default_picture_url',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more default users if needed
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
