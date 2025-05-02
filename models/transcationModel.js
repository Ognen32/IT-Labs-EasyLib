import { DataTypes } from "sequelize"; // Importing and using datatypes from sequelize
import { sequelize } from "../database/dbConnect.js";
// import Genre from './genresModel.js';

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expirationDate: {
    type: DataTypes.DATE,
  },
  borrowedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  returnedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'issued', 'returned', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
    timestamps: true,
});


export default Transaction;