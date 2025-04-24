import {createFavourite, findFavourite, findFavourites, sortFavouritesbyDate, sortFavouritesbyDateRange} from '../repositories/favouriteRepository.js';


export const setFavourite = async (userid, bookid) => {
    try {
        if (!userid || !bookid) throw new Error("Must Enter both");
        const foundedFavourite = await findFavourite(userid, bookid);
        if (foundedFavourite) throw new Error("This Instance already exist!");
        const createdFavourite = await createFavourite(userid, bookid);
        return createdFavourite;
    } catch (err) {
        throw new Error(err.message);
    }
};


export const getFavourites = async (userid) => {
    try {
        if (!userid) throw new Error("Must Enter userid!");
        const favourites = await findFavourites(userid);
        if (favourites.length === 0) {
            return { message: "No favourites found for this user." };
          }
        return favourites;
    } catch (err) {
        throw new Error(err.message);
    }
}


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
        const favouritesLastThreeDays = await sortFavouritesbyDate(userid, threeDaysAgo);
        const favouritesLastWeek = await sortFavouritesbyDateRange(userid, oneWeekAgo, threeDaysAgo);
        const favouritesLastMonth = await sortFavouritesbyDateRange(userid, thisMonth, oneWeekAgo);
        return { favouritesLastThreeDays, favouritesLastWeek, favouritesLastMonth};
    } catch (err) {
        throw new Error(err.message);
    }
}
