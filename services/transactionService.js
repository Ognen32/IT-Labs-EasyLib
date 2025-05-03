import { createTranscation, findAllActivePendingTransactions, findExpiredPendingTransactions} from "../repositories/transcationRepository.js";
import {
  createTranscationItem,
  checkExistingTransaction,
} from "../repositories/transcationItemRepository.js";
import {
  findUserLimit,
  updateUserLimit,
} from "../repositories/userRepository.js";
import { findCartItem } from "../repositories/cartRepository.js";
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
    console.log(userLimitUpdated);
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
      transaction.status = 'cancelled';
      if (transaction.User) {
        const numberOfBooks = transaction.TranscationItems?.length || 1;
        const updatelimit = await updateUserLimit(transaction.User.id, numberOfBooks)
        updatedUsersCount++;
      }
      await transaction.save(); // Save updated status
    }
    console.log(updatedUsersCount);
    // Step 3: Return all still-active pending transactions
    const activeTransactions = await findAllActivePendingTransactions(now);

    return activeTransactions;
  } catch (err) {
    throw new Error(err.message);
  }
};
