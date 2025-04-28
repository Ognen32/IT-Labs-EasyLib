"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Favourites", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE", // This ensures that when a user is deleted, their favourites are also deleted
      },
      bookid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Books",
          key: "bookid",
        },
        onDelete: "CASCADE", // This ensures that when a book is deleted, it is removed from all favourites
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

    // Add a unique constraint to ensure that a user can favourite the same book only once
    await queryInterface.addIndex("Favourites", ["userid", "bookid"], {
      unique: true,
      name: "favourite_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the index and the table if the migration is rolled back
    await queryInterface.removeIndex("Favourites", "favourite_unique");
    await queryInterface.dropTable("Favourites");
  },
};
