import Book from '../models/bookModel.js';


export const findBook = async function (title) {
    try {
    const book = await Book.findOne({where: {title: title}})
    return book;
    } catch (err) {
        return err.message;
    }
}




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
            availability: bookData.availability
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