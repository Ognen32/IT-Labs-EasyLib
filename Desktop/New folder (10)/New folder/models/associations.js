import Book from "./bookModel.js";
import Genre from "./genresModel.js";
import Favourite from "./favouriteModel.js";
import User from "./userModel.js";

Book.belongsToMany(Genre, {
  through: "BookGenres",
  foreignKey: "bookid",
  otherKey: "genreId",
});
Genre.belongsToMany(Book, {
  through: "BookGenres",
  foreignKey: "genreId",
  otherKey: "bookid",
});

Favourite.belongsTo(User, { foreignKey: "userid" });
User.hasMany(Favourite, { foreignKey: "userid" });

Favourite.belongsTo(Book, { foreignKey: "bookid" });
Book.hasMany(Favourite, { foreignKey: "bookid" });

export default { Book, Genre, User, Favourite };
