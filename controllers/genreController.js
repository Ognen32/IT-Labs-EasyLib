import { createGenre, getAllGenres } from "../services/genreService.js";

export const handleCreateGenre = async (req, res) => {
  try {
    const name = req.body.name;
    const newGenre = await createGenre(name);
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetGenres = async (req, res) => {
  try {
    const genresAll = await getAllGenres();
    res.status(200).json(genresAll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
