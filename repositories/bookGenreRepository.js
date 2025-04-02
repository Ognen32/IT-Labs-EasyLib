import Genre from '../models/bookGenreModel.js';

export const deleteBookGenreInstance = async function (bookid) {  
 try {
const deletedCount = await Genre.destroy({where:{bookid:bookid}});
 return deletedCount;
 } catch(err) {
    throw new Error(err.message);
 }
};