'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookGenres', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      bookid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Books', // Refers to the 'Books' table
          key: 'bookid',  // Refers to the primary key of the 'Books' table
          onDelete: 'CASCADE',  // Optional: if a book is deleted, remove related BookGenre entries
        },
      },
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Genres', // Refers to the 'Genres' table
          key: 'genreId',  // Refers to the primary key of the 'Genres' table
          onDelete: 'CASCADE',  // Optional: if a genre is deleted, remove related BookGenre entries
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique index to bookId and genreId
    await queryInterface.addIndex('BookGenres', ['bookid', 'genreId'], {
      unique: true,
      name: 'book_genre_unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the BookGenres table
    await queryInterface.dropTable('BookGenres');
  },
};
