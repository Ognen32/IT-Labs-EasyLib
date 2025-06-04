import {
  createBook,
  getBooks,
  getBookBySlug,
  removeBook,
  getBookById,
  updateBook,
  landingPageData,
  getFilteredLandingBooks,
  getLatestBooks,
} from "../services/bookService.js";

export const handleCreateBook = async (req, res) => {
  try {
    const {
      title,
      author,
      releaseDate,
      publishingHouse,
      description,
      shortDescription,
      availability,
      rating,
    } = req.body;
    const genres = req.body.genre;
    const covers = req.files;
    const bookData = {
      title: title,
      author: author,
      releaseDate: releaseDate,
      publishingHouse: publishingHouse,
      description: description,
      shortDescription: shortDescription,
      availability: availability,
      rating,
    };
    const book = await createBook(bookData, genres, covers);
    return res.status(201).json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const handlerGetAllBooks = async (req, res) => {
  try {
    const search = req.query.search || req.body.search;
    const genres = req.query.genre;
    const pageNum = req.query.pageNum || req.body.pageNum;
    const books = await getBooks(search, genres, pageNum);
    res.status(200).json(books);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const handleGetBookById = async (req, res) => {
  try {
    const bookid = req.params.bookid;
    console.log(bookid);
    const book = await getBookById(bookid);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetBookBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const book = await getBookBySlug(slug);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const handleRemoveBook = async (req, res) => {
  try {
    const bookid = req.params.bookid;
    const deletedBook = await removeBook(bookid);
    res.status(200).json(deletedBook);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const handleUpdateBook = async (req, res) => {
  try {
    const bookid = req.params.id;
    if (!bookid) {
      return res.status(400).json({ error: err.message });
    }

    const {
      title,
      author,
      releaseDate,
      publishingHouse,
      description,
      shortDescription,
      availability,
    } = req.body;

    const bookData = {
      title,
      author,
      releaseDate,
      publishingHouse,
      description,
      shortDescription,
      availability,
    };

    const newGenres = req.body.genre;
    const oldGenres = req.body.genreOld;

    const updatedBook = await updateBook(
      bookid,
      bookData,
      newGenres,
      oldGenres
    );
    return res.status(200).json(updatedBook);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};
// Tuka
export const getLatestBooksHanlder = async (req, res) => {
  try {
    const data = await getLatestBooks();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getLandingPageHandler = async (req, res) => {
  try {
    const data = await landingPageData();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getFilteredLandingBooksHandler = async (req, res) => {
  try {
    const search = req.query.search || req.body.search;
    const genres = req.body.genre;
    const data = await getFilteredLandingBooks(search, genres);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
