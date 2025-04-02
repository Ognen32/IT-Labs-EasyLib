import {createGenre, findGenreAll, createBookWithGenres, getBooksBySearchTerm, getBookBySlug, removeBookById} from '../services/bookService.js';

// OD TUKA -------------------------- GENRE CONTROLLER
export const addGenre = async (req,res) => {
    try {
    const name = req.body.name;
    const newGenre = await createGenre(name);
    res.status(201).json(newGenre);
    } catch (err)
    {
        res.status(500).json({error:err.message});
    }

};

export const getGenres = async (req, res) => {
    try {
        const genresAll = await findGenreAll();
        res.status(200).json(genresAll);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// DO TUKA -------------------------- GENRE CONTROLLER

export const addBook = async (req,res) => {
    try {
    const {title, author, releaseDate, publishingHouse, description, shortDescription, availability} = req.body;
    const genres = req.body.genre;
    const bookData = {
        title: title,
        author: author,
        releaseDate: releaseDate,
        publishingHouse: publishingHouse,
        description: description,
        shortDescription: shortDescription,
        availability: availability
    };
    const book = await createBookWithGenres(bookData, genres);
    return res.status(201).json(book);
} catch(err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
}
};

export const getBooksBySearch = async (req, res) => {
   
    try {
    const search = req.query.search;
    const books = await getBooksBySearchTerm(search);
    res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

export const getBookBySlugController = async (req,res) => {
    try {
        const slug = req.params.slug;
        const book = await getBookBySlug(slug);
        res.status(200).json(book);

    } catch (err) {
        res.status(404).json({error:err.message});
    }};

export const removeBookByIdController = async (req, res) => {
    try {
    const bookid = req.params.bookid;
    const deletedBook = await removeBookById(bookid);
    res.status(200).json(deletedBook);
    } catch (err) {
        res.status(404).json({error:err.message});
    }

}