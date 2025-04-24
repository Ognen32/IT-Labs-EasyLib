import Favourite from './favouriteModel.js';
import User from './userModel.js';
import Book from './bookModel.js';
import Genre from './genresModel.js';

Book.belongsToMany(Genre, { through: 'BookGenres', foreignKey: 'bookid', otherKey: 'genreId' });
Genre.belongsToMany(Book, { through: 'BookGenres', foreignKey: 'genreId', otherKey: 'bookid' });
//

// Many-to-one relationship between Favourite and User
Favourite.belongsTo(User, { foreignKey: 'userid' }); // A favourite belongs to one user
User.hasMany(Favourite, { foreignKey: 'userid' });   // A user can have many favourites

// Many-to-one relationship between Favourite and Book
Favourite.belongsTo(Book, { foreignKey: 'bookid' }); // A favourite belongs to one book
Book.hasMany(Favourite, { foreignKey: 'bookid' });   // A book can have many favourites

export default { Book, Genre, User, Favourite};
