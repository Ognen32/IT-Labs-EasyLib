import Favourite from "../models/favouriteModel.js";
import Book from '../models/bookModel.js';
import Genre from "../models/genresModel.js";
import { Op } from "sequelize";

export const createFavourite = async function (userid, bookid) {
  try {
    const favourite = await Favourite.create({
      userid: userid,
      bookid: bookid,
    });
    return favourite;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteFavourite = async function (userid, bookid) {
  try {
    const deleted = await Favourite.destroy({
      where: {
        userid: userid,
        bookid: bookid,
      },
    });
    return deleted;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const findFavourite = async function (userid, bookid) {
  try {
    const favourite = await Favourite.findOne({
      where: {
        userid: userid,
        bookid: bookid,
      },
    });
    return favourite;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findFavourites = async function (userid) {
  try {
    const favourites = await Favourite.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        userid: userid,
      },
      include: [
        {
          model: Book,
          attributes:["title", "author", "coverArt", "releaseDate", "slug", "rating"],
          include: [
            {
              model: Genre,
              attributes: ["genreId", "name" ]
            },
          ],
        },
      ],
    });
    return favourites;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const sortFavouritesbyDate = async function (userid, date) {
  try {
    const favourites = await Favourite.findAll({
      where: {
        userid: userid,
        createdAt: { [Op.gte]: date },
      },
      order: [["createdAt", "DESC"]], // Вака ќе ги покажи последните нови внесени поради што датите се гледат како број. Што понова дата што поголем број и DESC почнува од најголем до најмал и зато вака.
    });
    return favourites;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const sortFavouritesbyDateRange = async function (
  userid,
  startDate,
  endDate
) {
  try {
    const favourites = await Favourite.findAll({
      where: {
        userid: userid,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return favourites;
  } catch (err) {
    throw new Error(err.message);
  }
};
