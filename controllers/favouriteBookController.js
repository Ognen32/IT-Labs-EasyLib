import {
  toggleFavouriteBook,
  getFavouriteBooks,
  getSortedFavourites,
  checkFavouriteBook
} from "../services/favouriteBookService.js";


export const handleCheckFavouriteBook = async (req, res) => {
  try {
    const userid = req.user.id;
    const { bookid } = req.body;

    const isFavourite = await checkFavouriteBook(userid, bookid);

    res.status(200).json({ exists: isFavourite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handletoggleFavouriteBook = async (req, res) => {
  const userid = req.body.userid;
  const bookid = req.body.bookid;
  const token_data = req.user;

  const favourite = await toggleFavouriteBook(req.user.id, bookid);

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
