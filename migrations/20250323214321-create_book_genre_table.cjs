'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookGenre', {
      bookId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Books',
          key: 'bookId',
        },
        onDelete: 'CASCADE',
      },
      genreId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Genres',
          key: 'genreId',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('BookGenre');
  },
};