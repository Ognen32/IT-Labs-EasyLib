import {create_Genre, find_Genre} from '../repositories/genreRepository.js';


export const createGenre = async function (name) {  
    try {
    if (!name) {
        throw new Error ("Name must be entered");
    }
    const trim_name = name.trim();
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