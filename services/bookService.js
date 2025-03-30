import {create_Genre, find_Genre, find_Genre_All, find_GenreAll_byName,} from '../repositories/genreRepository.js';
import {createBook, findBook, findBooksSearch, findBookBySlug} from '../repositories/bookRepository.js';
import {capitalizeTrim} from '../utils/Capitalize_Trim.js';
import slugify from "slugify";


// OD TUKA -------------------------- GENRE SERVICE

export const createGenre = async function (name) {  
    try {
    if (!name) {
        throw new Error ("Name must be entered");
    }
    const trim_name = capitalizeTrim(name);
    const find_genre = await find_Genre(trim_name);
    if (!find_genre) {
        return await create_Genre(trim_name);
    }
    else {
        throw new Error("Genre already Exists")
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
        throw new Error("Cannot Access Book") // Прати линк 404.
    }
    const book = await findBookBySlug(slug);
    if (!book) {
        throw new Error("Book Does not exist.") // Прати линк 404.
    }
    return book;
} catch (err) {
    throw new Error(err.message);
}};


 export const createBookWithGenres = async (bookData, genres) => {
    
    try {
    
    for (let key in bookData) {
        if (!bookData[key]) throw new Error(`Field "${key}" must be entered`);
    }

    if ( await findBook(bookData.title))  
    {
        throw new Error("Book Already exists");
    };
    

     // Ensure genres is always an array
     if (!genres) {
        genres = []; // If no genres provided, set it to an empty array
    } else if (!Array.isArray(genres)) {
        genres = [genres]; // Convert single genre string to an array
    }

    bookData.slug = slugify(bookData.title, {lower:true});
    const book = await createBook(bookData);



    if (genres && genres.length > 0) {

        const bookGenres = [];
        for (let genreName of genres) {
            const genre = await find_Genre(genreName);
            if (genre) {
                bookGenres.push(genre);
            };
        };
        if (bookGenres.length > 0) {
            await book.setGenres(bookGenres);
        };
    };

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
}};