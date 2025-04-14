import Book from './bookModel.js';
import Genre from './genresModel.js';

Book.belongsToMany(Genre, { through: 'BookGenres', foreignKey: 'bookid', otherKey: 'genreId' });
Genre.belongsToMany(Book, { through: 'BookGenres', foreignKey: 'genreId', otherKey: 'bookid' });

export default { Book, Genre };
