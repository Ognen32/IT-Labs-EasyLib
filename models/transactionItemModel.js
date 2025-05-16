import { DataTypes } from "sequelize";
import { sequelize } from "../database/dbConnect.js";

const TransactionItem = sequelize.define("TransactionItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  transactionid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Transactions",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  bookid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Books",
      key: "bookid",
    },
    onDelete: "CASCADE",
  },
}, {
  timestamps: true,
});

export default TransactionItem;
