import {
  addFavouriteBook,
  getFavouriteBooks,
  getSortedFavourites,
} from "../services/favouriteBookService.js";

export const handleAddFavouriteBook = async (req, res) => {
  const userid = req.body.userid;
  const bookid = req.body.bookid;
  const token_data = req.user;

  const favourite = await addFavouriteBook(req.user.id, bookid);

  res.status(201).json(favourite);
};

export const handleGetFavouriteBooks = async (req, res) => {
  const token_data = req.user;
  const favourites = await getFavouriteBooks(req.user.id);

  res.status(200).json(favourites);
};

export const getSortedFavouritesHanlder = async (req, res) => {
  const token_data = req.user;
  console.log(token_data);

  const favourites = await getSortedFavourites(req.user.id);

  res.status(200).json(favourites);
};
