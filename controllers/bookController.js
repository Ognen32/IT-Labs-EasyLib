import {
  createBook,
  getBooks,
  getBookBySlug,
  removeBook,
  getBookById,
  updateBook,
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
    const search = req.query.search;
    const books = await getBooks(search);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetBookById = async (req, res) => {
  try {
    const bookid = req.params.bookid;
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
    const {
      title,
      author,
      releaseDate,
      publishingHouse,
      description,
      shortDescription,
      availability,
    } = req.body;
    const bookid = req.params.bookid;
    const bookData = {
      title: title,
      author: author,
      releaseDate: releaseDate,
      publishingHouse: publishingHouse,
      description: description,
      shortDescription: shortDescription,
      availability: availability,
    };
    const newGenres = req.body.genre;
    const oldGenres = req.body.genreOld;
    const updatedBook = await updateBook(
      bookid,
      bookData,
      newGenres,
      oldGenres
    );
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
