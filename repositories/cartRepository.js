import Cart from "../models/cartModel.js";
import Book from '../models/bookModel.js';

export const CartAdd = async function (userid, bookid) {
  try {
    const itemAdded = await Cart.create({
      userid: userid,
      bookid: bookid,
    });
    return itemAdded;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findCartItem = async function (userid, bookid) {
  try {
    const itemFound = await Cart.findOne({
      where: {
        userid: userid,
        bookid: bookid,
      },
    });
    return itemFound;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findCartItems = async function (userid) {
  try {
    const items = await Cart.findAll({
      where: {
        userid: userid,
      },
      include:{
        model: Book,
        attributes: ["bookid", "title", "author", "coverArt"],
      }
    });
    return items;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteCartItemsAll = async function (userid) {
  try {
    const deletedItemsAll = await Cart.destroy({where:{
      userid:userid,
    }});
    return deletedItemsAll;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const removeCartItem = async function (userid, bookid) {
  try {
    const itemFound = await Cart.destroy({
      where: {
        userid: userid,
        bookid: bookid,
      },
    });
    return itemFound;
  } catch (err) {
    throw new Error(err.message);
  }
};
