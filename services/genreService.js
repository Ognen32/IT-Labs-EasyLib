import {
  create,
  findByName,
  findGenres,
} from "../repositories/genreRepository.js";
import { capitalizeTrim } from "../utils/Capitalize_Trim.js";

export const createGenre = async function (name) {
  try {
    if (!name) {
      throw new Error("Name must be entered");
    }
    const trim_name = capitalizeTrim(name);
    const find_genre = await findByName(trim_name);
    if (!find_genre) {
      return await create(trim_name);
    } else {
      throw new Error("Genre already Exists");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllGenres = async function () {
  try {
    const genresAll = await findGenres();
    return genresAll;
  } catch (err) {
    console.error("Error fetching genres:", err.message);
    throw new Error(err.message);
  }
};
