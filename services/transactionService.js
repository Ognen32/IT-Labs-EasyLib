import {
  createTranscation,
  findAllActivePendingTransactions,
  findExpiredPendingTransactions,
} from "../repositories/transcationRepository.js";
import {
  createTranscationItem,
  checkExistingTransaction,
} from "../repositories/transcationItemRepository.js";
import {
  findUserLimit,
  updateUserLimit,
} from "../repositories/userRepository.js";
import { findCartItem } from "../repositories/cartRepository.js";
import {
  updateBookAvailability,
  findBookAvailability,
} from "../repositories/bookRepository.js";
import { ValidationError } from "../utils/error.js";

export const handleBuyNow = async (userid, bookid) => {
  try {
    if (!bookid) {
      throw new ValidationError("Must Enter bookid!");
    }

    const cartItem = await findCartItem(userid, bookid);
    if (cartItem) {
      throw new ValidationError(
        "Book is already in your cart. Please remove it or proceed to checkout."
      );
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

    const user = await findUserLimit(userid);
    if (!user) {
      throw new ValidationError("User not found");
    }

    const user_limit = user.limit;
    console.log(user);
    console.log(user_limit);
    if (user_limit <= 0) {
      throw new ValidationError(
        "User has excedeed maximum books at the moment!"
      );
    }

    const book = await findBookAvailability(bookid);
    if (!book) {
      throw new ValidationError("Book not found");
    }
    const book_availability = book.availability;
    console.log(book_availability);
    if (book_availability <= 0) {
      throw new ValidationError("There are no availability copies of the book");
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
    const transcationItem = await createTranscationItem(transaction.id, bookid);
    const userLimitUpdated = await updateUserLimit(userid, -1);
    const bookAvailabilityUpdated = await updateBookAvailability(bookid, -1);
    console.log(userLimitUpdated);
    console.log(bookAvailabilityUpdated);
    return { transaction, transcationItem };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getPendingTransactions = async () => {
  try {
    const now = new Date();

    // Step 1: Get all expired pending transactions
    const expiredTransactions = await findExpiredPendingTransactions(now);
    let updatedUsersCount = 0;

    // Step 2: Loop and update status + user limit
    for (const transaction of expiredTransactions) {
      transaction.status = "cancelled";
      if (transaction.User) {
        const numberOfBooks = transaction.TransactionItems?.length || 1;
        const updatelimit = await updateUserLimit(
          transaction.User.id,
          numberOfBooks
        );
        updatedUsersCount++;
        if (
          transaction.TransactionItems &&
          transaction.TransactionItems.length > 0
        ) {
          for (const item of transaction.TransactionItems) {
            console.log("Updating availability for bookid:", item.bookid);
            await updateBookAvailability(item.bookid, 1);
          }
        }
      }
      await transaction.save(); // Save updated status
    }
    
    const activeTransactions = await findAllActivePendingTransactions(now);

    return activeTransactions;
  } catch (err) {
    throw new Error(err.message);
  }
};
