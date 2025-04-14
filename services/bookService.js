import {
  create,
  findBook,
  findBooksSearch,
  findBookBySlug,
  deleteBook,
  findBookById,
  update,
} from "../repositories/bookRepository.js";
import {
  deleteBookGenreInstance,
  deleteBookGenreInstanceByIdANDTitle,
  createBookGenreInstance,
} from "../repositories/bookGenreRepository.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

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

export const getBooks = async (search) => {
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
    const book = await create(bookData);

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
      await update(bookid, bookUpdates);
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
