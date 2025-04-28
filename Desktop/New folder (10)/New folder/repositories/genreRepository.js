import Genre from "../models/genresModel.js";

export const findByName = async function (name) {
  const genre = await Genre.findOne({ where: { name: name } });
  return genre;
};

export const create = async function (name) {
  const genre = await Genre.create({ name: name });
  return genre;
};

export const findGenres = async function () {
  const genres = await Genre.findAll();
  return genres;
};
