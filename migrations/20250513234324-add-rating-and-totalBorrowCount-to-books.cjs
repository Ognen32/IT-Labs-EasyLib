'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Books', 'rating', {
      type: Sequelize.DOUBLE,
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      }
    });

    await queryInterface.addColumn('Books', 'totalBorrowCount', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Books', 'rating');
    await queryInterface.removeColumn('Books', 'totalBorrowCount');
  }
};
