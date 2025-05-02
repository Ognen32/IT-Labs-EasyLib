'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TransactionItems', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      transactionid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Transactions', 
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      bookid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Books', 
          key: 'bookid' 
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TransactionItems');
  }
};
