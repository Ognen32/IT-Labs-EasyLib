import Book from "../models/bookModel.js";
import { Op } from "sequelize"; // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
import Genre from "../models/genresModel.js";

export const findBook = async function (title) {
  try {
    const book = await Book.findOne({ where: { title: title } });
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBookById = async function (bookid) {
  try {
    const book = await Book.findOne({
      where: { bookid: bookid },
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          through: { attributes: [] },
        },
      ],
    });
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBookBySlug = async function (slug) {
  try {
    const book = await Book.findOne({
      where: { slug: slug },
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          through: { attributes: [] },
        },
      ],
    });
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBooksSearch = async function (search, limit, pageNum, ) {
  try {
    const books = await Book.findAll({
      attributes: ["bookid", "title", "author", "coverArt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit:limit,
      offset: (pageNum - 1) * limit
    });
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBooksSearchWithGenre = async function (search, limit, pageNum, genres) {
  try {
    const books = await Book.findAll({
      attributes: ["bookid", "title", "author", "coverArt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit:limit,
      offset: (pageNum - 1) * limit,
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          where: {
            name: {
              [Op.in]: genres,
            },
          },
          through: { attributes: [] },
        },
      ],
    });
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const create = async function (bookData) {
  try {
    const book = await Book.create({
      title: bookData.title,
      author: bookData.author,
      releaseDate: bookData.releaseDate,
      publishingHouse: bookData.publishingHouse,
      description: bookData.description,
      shortDescription: bookData.shortDescription,
      availability: bookData.availability,
      slug: bookData.slug,
      mainCover: bookData.mainCover,
      coverArt: bookData.coverArt,
    });
    return book;
  } catch (err) {
    // Check if there are validation errors
    if (err.errors && err.errors.length > 0) {
      // Return the first validation error message
      throw new Error(err.errors[0].message);
    } else {
      // Return a general error if no validation errors
      throw new Error(err.message);
    }
  }
};

export const deleteBook = async function (bookid) {
  try {
    const book = await Book.destroy({
      where: {
        bookid: bookid,
      },
    });
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const update = async function (bookid, bookData) {
  try {
    const book = await Book.update(
      {
        title: bookData.title,
        author: bookData.author,
        releaseDate: bookData.releaseDate,
        publishingHouse: bookData.publishingHouse,
        description: bookData.description,
        shortDescription: bookData.shortDescription,
        availability: bookData.availability,
      },
      {
        where: { bookid: bookid },
        individualHooks: true,
      }
    );
    return book;
  } catch (err) {
    if (err.errors && err.errors.length > 0) {
      throw new Error(err.errors[0].message);
    } else {
      throw new Error(`Failed to update book: ${err.message}`);
    }
  }
};

export const findBooksSearchLandingPage = async function () {
  try {
    const books = await Book.findAll({
      attributes: ["bookid", "title", "author", "coverArt"],
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          through: { attributes: [] },
        },
      ],
    });
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBooksBySearchOnly = async function (search) {
  // Ова само се користи за Landing Page дека го имаме лимитирано на 10
  try {
    const books = await Book.findAll({
      attributes: ["bookid", "title", "author", "coverArt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          through: { attributes: [] },
        },
      ],
    });
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBooksByGenresOnly = async function (genres) {
  // Ова само се користи за Landing Page дека го имаме лимитирано на 10
  try {
    const books = await Book.findAll({
      attributes: ["bookid", "title", "author", "coverArt"],
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          where: {
            name: {
              [Op.in]: genres,
            },
          },
          through: { attributes: [] },
        },
      ],
    });
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBooksBySearchAndGenres = async function (search, genres) {
  // Ова само се користи за Landing Page дека го имаме лимитирано на 10
  try {
    const books = await Book.findAll({
      attributes: ["bookid", "title", "author", "coverArt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          attributes: ["genreId", "name"],
          where: {
            name: {
              [Op.in]: genres,
            },
          },
          through: { attributes: [] },
        },
      ],
    });
    return books;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateBookAvailability = async function (bookid, num) {
  try {
    const [updatedRows] = await Book.increment("availability", {
      by: num,
      where: { bookid: bookid },
    });
    return updatedRows;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findBookAvailability = async function (bookid) {
  try {
    const book = await Book.findOne({ where:{
      bookid:bookid
    }});
    return book;
  } catch (err) {
    throw new Error(err.message);
  }
};