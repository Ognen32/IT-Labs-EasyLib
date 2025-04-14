import Genre from "../models/genresModel.js";

export const findByName = async function (name) {
  try {
    const genre = await Genre.findOne({ where: { name: name } });
    return genre;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const create = async function (name) {
  try {
    const genre = await Genre.create({ name: name });
    return genre;
  } catch (err) {
    return err.message;
  }
};

export const findGenres = async function () {
  try {
    const genres = await Genre.findAll();
    return genres;
  } catch (err) {
    throw new Error("Failed to retrieve genres");
  }
};
