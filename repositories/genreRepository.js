import Genre from '../models/genresModel.js';


export const find_Genre = async function (name) {
  try {
  const genre = await Genre.findOne({where: {name}});
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
 }