import Book from '../models/bookModel.js';
import {Op} from 'sequelize'; // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/


export const findBook = async function (title) {
    try {
    const book = await Book.findOne({where: {title: title}})
    return book;
    } catch (err) {
        throw new Error (err.message);
    }
}

export const findBookBySlug = async function (slug) {
    try {
    const book = await Book.findOne({where: {slug: slug}})
    return book;
    } catch (err) {
        throw new Error (err.message);
    }
}


export const findBooksSearch = async function (search) {
    try {
        const books = await Book.findAll({
            attributes:['bookid','title', 'author'],
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            order: [["title", "ASC"]]
        });
        return books;
    } catch (err) {
        throw new Error (err.message);
    }
};


export const createBook = async function (bookData) {
    try {
    const book = await Book.create(
        {
            title: bookData.title,
            author: bookData.author,
            releaseDate: bookData.releaseDate,
            publishingHouse: bookData.publishingHouse,
            description: bookData.description,
            shortDescription: bookData.shortDescription,
            availability: bookData.availability,
            slug: bookData.slug
        }
    );
    return book
} catch (err) {
    // Check if there are validation errors
    if (err.errors && err.errors.length > 0) {
        // Return the first validation error message
        throw new Error(err.errors[0].message);
    } else {
        // Return a general error if no validation errors
        throw new Error (err.message);
    }
}
};