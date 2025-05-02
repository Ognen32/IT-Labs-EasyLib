import { findCartItem, CartAdd } from "../repositories/cartRepository.js";
import { checkExistingTransaction } from "../repositories/transcationItemRepository.js";
import { ValidationError } from "../utils/error.js";

export const handleCartAdd = async (userid, bookid) => {
  try {
    if (!bookid) {
      throw new ValidationError("Must Enter bookid!");
    }

    const existingTransactionItem = await checkExistingTransaction(userid, bookid);
    if (existingTransactionItem) {
      throw new ValidationError("User already has an active transaction with this book.");
    }
    
    const cartItemFound = await findCartItem(userid, bookid);
    if (cartItemFound) {
      throw new ValidationError(
        "Book is already in your cart. Please remove it or proceed to checkout."
      );
    }
    const cartItem = await CartAdd(userid, bookid);
    return cartItem;
  } catch (err) {
    throw new Error(err.message);
  }
};
