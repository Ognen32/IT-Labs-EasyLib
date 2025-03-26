import {createGenre} from '../services/bookService.js';


export const addGenre = async (req,res) => {
    try {
    const name = req.body.name;
    const newGenre = await createGenre(name);
    res.status(201).json(newGenre);
    } catch (err)
    {
        res.status(500).json({error:err.message});
    }

}