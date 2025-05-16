import {
  findCartItem,
  CartAdd,
  findCartItems,
  deleteCartItemsAll,
  removeCartItem
} from "../repositories/cartRepository.js";
import { checkExistingTransaction } from "../repositories/transcationItemRepository.js";
import {
  findUserLimit,
  updateUserLimit,
} from "../repositories/userRepository.js";
import {
  findBookAvailability,
  updateBookAvailability,
} from "../repositories/bookRepository.js";
import { createTranscation } from "../repositories/transcationRepository.js";
import { createTranscationItem } from "../repositories/transcationItemRepository.js";
import { ValidationError } from "../utils/error.js";

export const handleCartAdd = async (userid, bookid) => {
  try {
    if (!bookid) {
      throw new ValidationError("Must Enter bookid!");
    }

    const user = await findUserLimit(userid);
    if (!user) {
      throw new ValidationError("User not found");
    }
    const user_limit = user.limit;

    if (user_limit <= 0) {
      throw new ValidationError(
        "User has excedeed maximum books at the moment!"
      );
    }

    const book = await findBookAvailability(bookid);
    const book_availability = book.availability;

    if (book_availability <= 0) {
      throw new ValidationError("There are no availability copies of the book");
    }

    const existingTransactionItem = await checkExistingTransaction(
      userid,
      bookid
    );
    if (existingTransactionItem) {
      throw new ValidationError(
        "User already has an active transaction with this book."
      );
    }

    const cartItemFound = await findCartItem(userid, bookid);
    if (cartItemFound) {
      throw new ValidationError(
        "Book is already in your cart. Please remove it or proceed to checkout."
      );
    }
    const cartItem = await CartAdd(userid, bookid);
    await updateUserLimit(userid, -1);
    await updateBookAvailability(bookid, -1);
    return cartItem;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const handlegetCartItems = async (userid) => {
  try {
    const items = await findCartItems(userid);
    if (!items || items.length <= 0) {
      throw new ValidationError("Cart Empty!");
    }
    return items;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const handleCartSubmit = async (userid) => {
  try {
    const items = await findCartItems(userid);
    if (!items || items.length <= 0) {
      throw new ValidationError("Nothing to submit, Cart is empty!");
    }
    const now = new Date();
    const issueDate = new Date(now);
    const expirationDate = new Date(now);
    expirationDate.setDate(expirationDate.getDate() + 3);
    const transaction = await createTranscation(
      userid,
      issueDate,
      expirationDate
    );
    for (const item of items) {
      await createTranscationItem(transaction.id, item.Book.bookid);
    }
    await deleteCartItemsAll(userid);
    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const handleCartItemRemove = async (userid, bookid) => {
  try {
    if (!bookid) {
      throw new ValidationError("Must Enter bookid!");
    }

    if (!userid) {
      throw new ValidationError("Must Enter userid!");
    }

    const cartItemFound = await findCartItem(userid, bookid);
    if (!cartItemFound) {
      throw new ValidationError(
        "Book is not in cart!"
      );
    }
    const itemFound = await removeCartItem(userid, bookid);
    if (itemFound === 0) {
      throw new Error("Cart item not found.");
    }

    await updateUserLimit(userid, 1);
    await updateBookAvailability(bookid, 1);
    return cartItemFound;
  } catch(err) {
    throw new Error(err.message);
  }
};