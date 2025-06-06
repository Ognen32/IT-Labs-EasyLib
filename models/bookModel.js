import { DataTypes } from 'sequelize'; // Importing and using datatypes from sequelize
import { sequelize } from '../database/dbConnect.js';
// import Genre from './genresModel.js';

const Book = sequelize.define("Book", {

    bookid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull:false,
        validate: {
            len: {
                args: [3,100],
                msg: "Title must be between 3 and 100 characters."
            }
        }
    },
    slug: {
        type:DataTypes.STRING(100),
        unique:true,
        allowNull:true

    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: {
                args: [3,100],
                msg: "Author must be between 3 and 100 characters."
            }
        }
    },
    releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                args: true,
                msg: "Release date must be a valid date in ISO 8601 format (YYYY-MM-DD)."
            },
            isBefore: {
                args: [new Date().toISOString()],
                msg: "Release date cannot be in the future."
            }
        }
    },
    publishingHouse: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: {
                args: [3,50],
                msg: "Publishing house name must be between 3 and 50 characters."
            },
            
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [50,1000],
                msg: "Description must be between 50 and 1000 characters long."
            }
        }
    },

    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [50,250],
                msg: "Short description must be between 50 and 250 characters long."
            }
        }
    },
    availability: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            isInt: "Availability must be a valid integer.",
            min: {
            args: [0],
            msg: "Availability must be a positive number"
            }
        }
    },
    mainCover: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coverArt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.DOUBLE,
        allowNull:true,
        validate: {
            min: {
                args: [0],
                msg: "Rating cannot be below 0."
            },
            max: {
                args: [5],
                msg: "Rating cannot be above 5."
              }
        }
    },
    totalBorrowCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, 
{
    timestamps: true,
    hooks: {
        beforeSave: (book) => {
            book.title = book.title.trim();
            book.author = book.author.trim();
            book.publishingHouse = book.publishingHouse.trim();
            book.description = book.description.trim();
            book.shortDescription = book.shortDescription.trim();
            if (book.slug) {
                book.slug = book.slug.trim().toLowerCase();
            }
        }
    }
});

// Book.belongsToMany(Genre, {
//     through: 'BookGenres', // Join table
//     foreignKey: 'bookid', // Foreign key for Book
//     otherKey: 'genreId', // Foreign key for Genre
//   });

export default Book;