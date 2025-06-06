import {
  create,
  findBook,
  findBooksSearch,
  findBookBySlug,
  deleteBook,
  findBookById,
  update,
  findBooksSearchLandingPage,
  findBooksBySearchOnly,
  findBooksByGenresOnly,
  findBooksBySearchAndGenres,
  findBooksSearchWithGenre,
  findBooksSearchLandingPageCatalog,
  findBooksLatestAdded
} from "../repositories/bookRepository.js";
import { findByName } from "../repositories/genreRepository.js";
import {
  deleteBookGenreInstance,
  deleteBookGenreInstanceByIdANDTitle,
  createBookGenreInstance,
} from "../repositories/bookGenreRepository.js";
import slugify from "slugify";
import { uploadImage } from "./cloudinaryService.js";

export const getBookBySlug = async (slug) => {
  try {
    if (!slug) {
      throw new Error("Cannot Access Book"); // Прати линк 404.
    }
    const book = await findBookBySlug(slug);
    if (!book) {
      throw new Error("Book Does not exist."); // Прати линк 404.
    }
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getBookById = async (bookid) => {
  try {
    if (!bookid) {
      throw new Error("Cannot Access Book");
    }
    const book = await findBookById(bookid);
    if (!book) {
      throw new Error("Book Does not exist.");
    }
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getBooks = async (search, genres, pageNum) => {
  try {
    if (!search) {
      throw new Error("Enter Search for testing ATM");
    }
    console.log(pageNum);
    if (!genres) {
      genres = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genres)) {
      genres = [genres]; // Convert single genre string to an array
    }
    console.log(genres);
    const limit = 12;

    if (
      search &&
      search.trim() !== "" &&
      genres &&
      genres.length > 0 &&
      pageNum
    ) {
      const books = await findBooksSearchWithGenre(
        search,
        limit,
        pageNum,
        genres
      );
      const filteredBooks = books.filter((book) => {
        const bookGenres = book.Genres.map((g) => g.name);
        return genres.every((g) => bookGenres.includes(g));
      });

      if (!filteredBooks || filteredBooks.length === 0) {
        throw new Error("No books found with the given search and genres.");
      }

      return filteredBooks;
    }

    if (search && genres.length > 0 && !pageNum) {
      const books = await findBooksSearchWithGenre(search, limit, 1, genres); // default to page 1
      const filteredBooks = books.filter((book) => {
        const bookGenres = book.Genres.map((g) => g.name);
        return genres.every((g) => bookGenres.includes(g));
      });

      if (!filteredBooks || filteredBooks.length === 0) {
        throw new Error("No books found with the given search and genres.");
      }

      return filteredBooks;
    }

    if (search && genres.length === 0 && pageNum) {
      const books = await findBooksSearch(search, limit, pageNum);

      if (!books || books.length === 0) {
        throw new Error("No books found with the given search.");
      }

      return books;
    }

    // Default fallback (search only)
    const books = await findBooksSearch(search, limit, 1); // default to page 1
    if (!books || books.length === 0) {
      throw new Error("No books found with the given search.");
    }

    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const createBook = async (bookData, genres, covers) => {
  try {
    for (let key in bookData) {
      if (!bookData[key]) throw new Error(`Field "${key}" must be entered`);
    }
    if (!covers || covers.length !== 2) {
      throw new Error("You must upload exactly 2 cover images.");
    }

    if (await findBook(bookData.title)) {
      throw new Error("Book Already exists");
    }

    // Create data URIs for both cover images
    const mainCover = `data:${
      covers[0].mimetype
    };base64,${covers[0].buffer.toString("base64")}`;
    const coverArt = `data:${
      covers[1].mimetype
    };base64,${covers[1].buffer.toString("base64")}`;

    const mainCoverResult = await uploadImage(
      mainCover,
      "book_mainCover",
      `book_cover_main_${Date.now()}`
    );
    const coverArtResult = await uploadImage(
      coverArt,
      "book_covers_coverArt",
      `book_cover_art_${Date.now()}`
    );

    if (!genres) {
      genres = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genres)) {
      genres = [genres]; // Convert single genre string to an array
    }

    bookData.slug = slugify(bookData.title, { lower: true });
    bookData.mainCover = mainCoverResult.url;
    bookData.coverArt = coverArtResult.url;
    const book = await create(bookData);

    if (genres && genres.length > 0) {
      const bookGenres = [];
      for (let genreName of genres) {
        const genre = await findByName(genreName);
        if (genre) {
          bookGenres.push(genre);
        }
      }
      if (bookGenres.length > 0) {
        await book.setGenres(bookGenres);
      }
    }

    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeBook = async (bookid) => {
  try {
    if (!bookid) {
      throw new Error("Book ID must be provided.");
    }
    await deleteBookGenreInstance(bookid);
    const deletedCount = await deleteBook(bookid);
    if (deletedCount === 0) {
      throw new Error("Book not found. Deletion failed.");
    }
    return { message: "Book was successfully deleted." };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateBook = async (bookid, bookData, genres, genresOld) => {
  try {
    const book = await findBookById(bookid);
    if (!book) {
      throw new Error("Book does not exist.");
    }

    const bookUpdates = {};
    for (let key in bookData) {
      if (bookData[key] !== undefined && bookData[key] !== null) {
        if (typeof bookData[key] === "string") {
          bookData[key] = bookData[key].trim();
        }
        if (bookData[key] !== book[key]) {
          bookUpdates[key] = bookData[key];
        }
      }
    }

    if (Object.keys(bookUpdates).length > 0) {
      await update(bookid, bookUpdates);
    }

    if (genresOld && genresOld.length > 0) {
      const genresToRemove = book.Genres.filter((g) =>
        genresOld.includes(g.name)
      );
      for (let genre of genresToRemove) {
        await deleteBookGenreInstanceByIdANDTitle(bookid, genre.genreId);
      }
    }

    if (genres && genres.length > 0) {
      for (let genreName of genres) {
        const foundGenre = await findByName(genreName);
        if (foundGenre) {
          await createBookGenreInstance(bookid, foundGenre.genreId);
        }
      }
    }

    return { message: "Book Updated Correctly!" };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Tuka

export const getLatestBooks = async () => {
  try{
    const latestBooks = await findBooksLatestAdded();
    console.log(latestBooks);
    if (!latestBooks || latestBooks.length === 0) {
      throw new Error("No books found");
    }
    return latestBooks;
  } catch (err) {
    throw new Error("No books found");
  }
};

export const landingPageData = async () => {
  try {
    const books_search = await findBooksSearchLandingPage();
    if (!books_search || books_search.length === 0) {
      throw new Error("No books found");
    }
    return books_search;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getFilteredLandingBooks = async (search, genres) => {
  try {
    if (search && search.trim() != "") {
      search = search.trim();
    }
    if (!genres) {
      genres = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genres)) {
      genres = [genres]; // Convert single genre string to an array
    }

    if (search && search.trim() !== "" && genres && genres.length > 0) {
      // МНОГУ БИТНО ЗА ПОСЛЕ ДА СЕ ИСКОРИСТИ ЛОГИКАТА
      // Search and genres are both provided
      const books = await findBooksBySearchAndGenres(search, genres);

      const filteredBooks = books.filter((book) => {
        const bookGenres = book.Genres.map((g) => g.name);
        return genres.every((g) => bookGenres.includes(g));
      });

      if (!filteredBooks || filteredBooks.length === 0) {
        throw new Error("No books found with the given search and genres.");
      }

      return filteredBooks;
    } else if (search && search.trim() !== "") {
      // Only search is provided
      const books = await findBooksBySearchOnly(search);
      if (!books || books.length === 0) {
        throw new Error("No books found with the given search and genres.");
      }
      return books;
    } else if (genres && genres.length > 0) {
      // Only genres are provided
      const books = await findBooksByGenresOnly(genres);

      if (!books || books.length === 0) {
        throw new Error("No books found with the given search and genres.");
      }

      return books;
    } else {
      const books_search = await findBooksSearchLandingPageCatalog();
      return books_search;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
