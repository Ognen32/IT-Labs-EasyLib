import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnect.js';

const BookGenre = sequelize.define('BookGenre', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  bookid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Books', 
      key: 'bookid',  
      onDelete: 'CASCADE',  
    },
  },
  genreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Genres', 
      key: 'genreId', 
      onDelete: 'CASCADE',  
    },
  },
}, {
    timestamps: true,  
    indexes: [
    {
      unique: true,
      fields: ['bookid', 'genreId'],
    },
  ],
});

export default BookGenre;
