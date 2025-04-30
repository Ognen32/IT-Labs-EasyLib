'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'limit', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 5,
    });

    await queryInterface.addColumn('Users', 'issueDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'expirationDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'limit');
    await queryInterface.removeColumn('Users', 'issueDate');
    await queryInterface.removeColumn('Users', 'expirationDate');
  }
};
