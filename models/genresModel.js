import { DataTypes } from 'sequelize'; 
import { sequelize } from '../database/dbConnect.js';
// import Book from './bookModel.js';

const Genre = sequelize.define("Genre", {
    genreId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
        validate: {
            len: {
                args: [3,30],
                msg: "Name must be between 3 and 30 characters."
            }
        }
    }},
{
    timestamps: true,
});

// Genre.belongsToMany(Book, {
//     through: 'BookGenres', // Join table
//     foreignKey: 'genreId', // Foreign key for Genre
//     otherKey: 'bookid', // Foreign key for Book
//   });

export default Genre;