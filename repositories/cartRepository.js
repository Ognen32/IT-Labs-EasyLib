import Cart from "../models/cartModel.js";

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
