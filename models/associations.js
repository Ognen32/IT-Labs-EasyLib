import Book from "./bookModel.js";
import Genre from "./genresModel.js";
import Favourite from "./favouriteModel.js";
import User from "./userModel.js";
import Transaction from "./transcationModel.js";
import TransactionItem from './transactionItemModel.js';
import Cart from "./cartModel.js";

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

// User to Transaction association
User.hasMany(Transaction, { foreignKey: "userid", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "userid" });

// One Transaction has many TransactionItems
Transaction.hasMany(TransactionItem, { foreignKey: 'transactionid', onDelete: 'CASCADE' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionid' });

// One Book can be part of many TransactionItems
Book.hasMany(TransactionItem, { foreignKey: 'bookid', onDelete: 'CASCADE' });
TransactionItem.belongsTo(Book, { foreignKey: 'bookid' });

// User <-> Cart
User.hasMany(Cart, { foreignKey: 'userid', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userid' });

// Book <-> Cart
Book.hasMany(Cart, { foreignKey: 'bookid', onDelete: 'CASCADE' });
Cart.belongsTo(Book, { foreignKey: 'bookid' });



export default { Book, Genre, User, Favourite, Transaction, TransactionItem, Cart };
