import { DataTypes } from 'sequelize'; 
import { sequelize } from '../database/dbConnect.js';

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

Genre.belongsToMany(Book, { through: 'BookGenres', foreignKey: 'genreId', otherKey: 'bookid' });

export default Genre;