import { DataTypes } from "sequelize"; // Importing and using datatypes from sequelize
import { sequelize } from "../database/dbConnect.js";

const Favourite = sequelize.define(
  "Favourite",
  {
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
    bookid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Books",
        key: "bookid",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userid", "bookid"],
      },
    ],
  }
);

export default Favourite;
