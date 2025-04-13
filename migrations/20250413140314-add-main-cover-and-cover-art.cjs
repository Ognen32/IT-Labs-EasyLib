'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Books', 'mainCover', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Books', 'coverArt', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Books', 'mainCover');
    await queryInterface.removeColumn('Books', 'coverArt');
  }
};
