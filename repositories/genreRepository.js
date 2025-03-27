import Genre from '../models/genresModel.js';


export const find_Genre = async function (name) {
  try {
  const genre = await Genre.findOne({where: {name:name}});
  return genre
} catch (err) {
  throw new Error(err.message)
}
};


export const  create_Genre = async function (name) {
  try
  {
   const genre = await Genre.create({name:name});
   return genre;
  } catch (err) {
    return err.message;
  }
 };


 export const find_Genre_All = async function () {
  try {
    const genres = await Genre.findAll();
    return genres;
  } catch(err) {
    throw new Error("Failed to retrieve genres");
  }
 };


 export const find_GenreAll_byName = async function (name) {
  try {
    const genres = await Genre.findAll({where:{name: name}});
    return genres;
  } catch(err) {
    throw new Error("Failed to retrieve genres");
  }
 };

