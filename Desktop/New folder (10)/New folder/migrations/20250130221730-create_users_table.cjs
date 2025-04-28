"use strict";

// Generated sequelize migration file (Empty when generated)
// The rest are from the userModel with an added ID

module.exports = { // Module used to create the users table
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,  // Stores just the date
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,  // This can be null until the user requests a reset
      },
      resetPasswordExpire: {
        type: Sequelize.DATE,
        allowNull: true,  // Expiry date for the reset token - initially null
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Sets the time that the user was created
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Update time when user record is updated
      }
    });
  },
// Method used to drop the users table

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};