import {
  createFavourite,
  findFavourite,
  findFavourites,
  sortFavouritesbyDate,
  sortFavouritesbyDateRange,
  deleteFavourite
} from "../repositories/favouriteBookRepository.js";
import { ValidationError } from "../utils/error.js";


export const checkFavouriteBook = async (userid, bookid) => {
  if (!userid || !bookid) {
    throw new ValidationError("User ID and Book ID are required.");
  }

  const favourite = await findFavourite(userid, bookid);
  return !!favourite; // returns true or false
};

export const toggleFavouriteBook = async (userid, bookid) => {
  if (!userid || !bookid)
    throw new ValidationError("Must Enter both userId and bookId");

  const existingFavourite = await findFavourite(userid, bookid);

  if (existingFavourite) {
    await deleteFavourite(userid, bookid);
    return { status: "removed", message: "Book removed from favourites" };
  }

  const createdFavourite = await createFavourite(userid, bookid);
  return { status: "added", message: "Book added to favourites", data: createdFavourite };
};

export const getFavouriteBooks = async (userid) => {
  if (!userid) throw new ValidationError("Must enter userid!");

  const favourites = await findFavourites(userid);

  return favourites || []; // Return empty array if null or undefined (extra safe)
};

export const getSortedFavourites = async (userid) => {
  try {
    if (!userid) throw new Error("Must Enter userid!");
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const thisMonth = new Date(now);
    thisMonth.setMonth(now.getMonth() - 1);
    const favouritesLastThreeDays = await sortFavouritesbyDate(
      userid,
      threeDaysAgo
    );
    const favouritesLastWeek = await sortFavouritesbyDateRange(
      userid,
      oneWeekAgo,
      threeDaysAgo
    );
    const favouritesLastMonth = await sortFavouritesbyDateRange(
      userid,
      thisMonth,
      oneWeekAgo
    );
    return { favouritesLastThreeDays, favouritesLastWeek, favouritesLastMonth };
  } catch (err) {
    throw new Error(err.message);
  }
};
