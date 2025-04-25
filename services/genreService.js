import {
  create,
  findByName,
  findGenres,
} from "../repositories/genreRepository.js";
import { capitalizeTrim } from "../utils/Capitalize_Trim.js";
import { ValidationError } from "../utils/error.js";

export const createGenre = async function (name) {
  if (!name) {
    throw new ValidationError("Name must be entered");
  }

  const trimmedName = capitalizeTrim(name);
  const existingGenre = await findByName(trimmedName);

  if (existingGenre) {
    throw new ValidationError("Genre already exists");
  }

  return create(trimmedName);
};

export const getAllGenres = async function () {
  const genresAll = await findGenres();
  return genresAll;
};
