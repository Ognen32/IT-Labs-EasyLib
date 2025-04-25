import {
  createFavourite,
  findFavourite,
  findFavourites,
  sortFavouritesbyDate,
  sortFavouritesbyDateRange,
} from "../repositories/favouriteBookRepository.js";
import { ValidationError } from "../utils/error.js";

export const addFavouriteBook = async (userid, bookid) => {
  if (!userid || !bookid)
    throw new ValidationError("Must Enter both userId and bookId");

  const foundedFavourite = await findFavourite(userid, bookid);

  if (foundedFavourite)
    throw new ValidationError("This Instance already exist!");

  const createdFavourite = await createFavourite(userid, bookid);
  return createdFavourite;
};

export const getFavouriteBooks = async (userid) => {
  if (!userid) throw new ValidationError("Must Enter userid!");

  const favourites = await findFavourites(userid);

  if (favourites.length === 0)
    throw new ValidationError("No favourites found for this user.");
  {
    return favourites;
  }
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
