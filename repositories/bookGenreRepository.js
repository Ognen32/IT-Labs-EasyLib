import BookGenre  from '../models/bookGenreModel.js';

export const createBookGenreInstance = async function (bookid, genreId) {
   try {
      const bookGenreInstance = await BookGenre.create({
         bookid: bookid,
         genreId: genreId
      });
      return bookGenreInstance;
   } catch (err) {
      throw new Error(err.message);
   }
};


export const deleteBookGenreInstance = async function (bookid) {  
 try {
const deletedCount = await BookGenre.destroy({where:{bookid:bookid}});
 return deletedCount;
 } catch(err) {
    throw new Error(err.message);
 }
};

export const deleteBookGenreInstanceByIdANDTitle = async function (bookid, genreId) {
   try {
      const deletedCount = await BookGenre.destroy({
         where: {
            bookid: bookid,
            genreId: genreId 
         }
      });
      return deletedCount; 
   } catch (err) {
      throw new Error(err.message);
   }
}
