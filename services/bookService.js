import {
  create_Genre,
  find_Genre,
  find_Genre_All,
  find_GenreAll_byName,
} from "../repositories/genreRepository.js";
import {
  createBook,
  findBook,
  findBooksSearch,
  findBookBySlug,
  deleteBook,
  findBookById,
  updateBook,
  findBooksSearchLandingPage,
  findBooksBySearchOnly,
  findBooksByGenresOnly,
  findBooksBySearchAndGenres,
} from "../repositories/bookRepository.js";
import {
  deleteBookGenreInstance,
  deleteBookGenreInstanceByIdANDTitle,
  createBookGenreInstance,
} from "../repositories/bookGenreRepository.js";
import { capitalizeTrim } from "../utils/Capitalize_Trim.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinarySetup.js";

// OD TUKA -------------------------- GENRE SERVICE

export const createGenre = async function (name) {
  try {
    if (!name) {
      throw new Error("Name must be entered");
    }
    const trim_name = capitalizeTrim(name);
    const find_genre = await find_Genre(trim_name);
    if (!find_genre) {
      return await create_Genre(trim_name);
    } else {
      throw new Error("Genre already Exists");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findGenreAll = async function () {
  try {
    const genresAll = await find_Genre_All();
    return genresAll;
  } catch (err) {
    console.error("Error fetching genres:", err.message);
    throw new Error(err.message);
  }
};

// DO TUKA -------------------------- GENRE SERVICE

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

export const createBookWithGenres = async (bookData, genres, covers) => {
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

    const mainCoverResult = await cloudinary.uploader.upload(mainCover, {
      folder: "book_mainCover", // Folder in Cloudinary
      public_id: `book_cover_main_${Date.now()}`, // Unique ID for the image
      resource_type: "image",
      format: "png",
    });

    // Upload CoverArt to Cloudinary (transform to WebP)
    const coverArtResult = await cloudinary.uploader.upload(coverArt, {
      folder: "book_covers_coverArt",
      public_id: `book_cover_art_${Date.now()}`, // Unique ID for the image
      resource_type: "image",
      format: "png",
    });

    // Ensure genres is always an array
    if (!genres) {
      genres = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genres)) {
      genres = [genres]; // Convert single genre string to an array
    }

    bookData.slug = slugify(bookData.title, { lower: true });
    bookData.mainCover = mainCoverResult.url;
    bookData.coverArt = coverArtResult.url;
    const book = await createBook(bookData);

    if (genres && genres.length > 0) {
      const bookGenres = [];
      for (let genreName of genres) {
        const genre = await find_Genre(genreName);
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

export const getBooksBySearchTerm = async (search) => {
  try {
    if (!search) {
      throw new Error("Enter Search for testing ATM");
    }
    const books = await findBooksSearch(search);
    if (!books || books.length === 0) {
      throw new Error("Book does not exist. Enter Again.");
    }
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeBookById = async (bookid) => {
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

export const updateBookById = async (bookid, bookData, genres, genresOld) => {
  try {
    for (let key in bookData) {
      if (!bookData[key]) throw new Error(`Field "${key}" must be entered`);
    }
    console.log(genres);
    const book = await findBookById(bookid);
    if (!book) {
      throw new Error("Book does not exist.");
    }
    const bookUpdates = {};
    for (let key in bookData) {
      if (bookData[key] !== undefined && bookData[key] !== null) {
        if (typeof bookData[key] === "string") {
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
          bookData[key] = bookData[key].trim();
        }
        if (bookData[key] !== book[key]) bookUpdates[key] = bookData[key];
      }
    }
    if (Object.keys(bookUpdates).length > 0) {
      // This condition will be true because there are changes in bookUpdates
      await updateBook(bookid, bookUpdates);
    }

    if (!genresOld) {
      genresOld = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genresOld)) {
      genresOld = [genresOld]; // Convert single genre string to an array
    }

    if (genresOld && genresOld.length > 0) {
      const genresToRemove = book.Genres.filter(
        (existingGenre) => genresOld.includes(existingGenre.name) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
      );

      for (let genre of genresToRemove) {
        await deleteBookGenreInstanceByIdANDTitle(bookid, genre.genreId);
      }
    }
    if (!genres) {
      genres = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genres)) {
      genres = [genres]; // Convert single genre string to an array
    }

    if (genres && genres.length > 0) {
      for (let genreName of genres) {
        const genres = await find_Genre(genreName);
        console.log(genres);
        if (genres) {
          await createBookGenreInstance(bookid, genres.genreId);
        }
      }
    }

    return { message: "Book Updated Correctly!" };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const landingPageData = async () => {
  // Трендинг уште не е тука несме готови
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
      const books_search = await findBooksSearchLandingPage();
      return books_search;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
