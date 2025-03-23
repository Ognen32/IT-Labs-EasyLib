import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnect.js';

const Genre = sequelize.define(
  'Genre',
  {
    genreId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 15],
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default Genre;