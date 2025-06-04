import {
  createTranscation,
  findAllActivePendingTransactions,
  findExpiredPendingTransactions,
  confirmTransaction,
  findAllIssuedTransactions,
  findTransactionsByPKPending,
  findTransactionsByPKIssued
} from "../repositories/transcationRepository.js";
import {
  createTranscationItem,
  checkExistingTransaction,
  findReturnedBooksByUserAndDateRange,
  findIssuedBooksByUserDueDateRange,
  findIssuedBooksByUserDueDateWithTIme
} from "../repositories/transcationItemRepository.js";
import {
  findUserLimit,
  updateUserLimit,
} from "../repositories/userRepository.js";
import { findCartItem } from "../repositories/cartRepository.js";
import {
  updateBookAvailability,
  findBookAvailability,
  incrementTotalBorrowed
} from "../repositories/bookRepository.js";
import { ValidationError } from "../utils/error.js";
import { subDays, subMonths, startOfYear, startOfDay, endOfDay, addDays, } from "date-fns";

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

export const handleConfirmTransaction = async (transactionid) => {
  try {
    if (!transactionid) {
      throw new ValidationError("Transaction ID is required.");
    }
    const now = new Date();
    const borrowedDate = new Date(now);
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);
    const result = await confirmTransaction(
      transactionid,
      borrowedDate,
      dueDate
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getIssuedTransactions = async () => {
  try {
    const issuedTransactions = await findAllIssuedTransactions();
    if (!issuedTransactions || issuedTransactions.length === 0) {
      return []; // ✅ Just return an empty array
    }

    for (const transaction of issuedTransactions) {
      const borrowed = new Date(transaction.borrowedDate);
      const due = new Date(transaction.dueDate);

      // Reset time part for accurate day difference
      borrowed.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      const diffMs = due - borrowed;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      // Also update in-memory object so returned data is correct
      transaction.diffDate = diffDays;

      // Update in DB
      await transaction.save();
    }
    console.log(issuedTransactions);
    return issuedTransactions; // Return the correct variable name
  } catch (err) {
    throw new Error(err.message);
  }
};

export const handleCancelTransaction = async (transactionid) => {
  try {
    if (!transactionid) {
      throw new Error("Transaction ID is missing!");
    }

    const transaction = await findTransactionsByPKPending(transactionid);

    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    if (transaction.User) {
      const numberOfBooks = transaction.TransactionItems?.length || 1;

      await updateUserLimit(transaction.User.id, numberOfBooks);

      if (transaction.TransactionItems && transaction.TransactionItems.length > 0) {
        for (const item of transaction.TransactionItems) {
          console.log("Updating availability for bookid:", item.bookid);
          await updateBookAvailability(item.bookid, 1);
        }
      }
    }

    transaction.status = "cancelled";
    await transaction.save(); // await here is important

    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const handleConfirmReturn = async (transactionid) => {
  try {
    if (!transactionid) {
      throw new Error("Transaction ID is missing!");
    }

    const transaction = await findTransactionsByPKIssued(transactionid);

    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    if (transaction.User) {
      const numberOfBooks = transaction.TransactionItems?.length || 1;

      await updateUserLimit(transaction.User.id, numberOfBooks);

      if (transaction.TransactionItems && transaction.TransactionItems.length > 0) {
        for (const item of transaction.TransactionItems) {
          console.log("Updating availability for bookid:", item.bookid);
          await updateBookAvailability(item.bookid, 1);
          await incrementTotalBorrowed(item.bookid, 1);
        }
      }
    }
    transaction.status = "returned";
    transaction.returnedDate = new Date();
    await transaction.save(); // await here is important

    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const handleGetReturnedBooksByDateRanges = async (userid) => {
  try {
    const today = new Date();

    const ranges = {
      last3Days: {
        startDate: startOfDay(subDays(today, 2)),
        endDate: endOfDay(today),
      },
      lastWeek: {
        startDate: startOfDay(subDays(today, 6)),
        endDate: endOfDay(subDays(today, 3)), // the day *before* last3Days starts
      },
      lastMonth: {
        startDate: startOfDay(subMonths(today, 1)),
        endDate: endOfDay(subDays(today, 7)), // the day *before* lastWeek starts
      },
      last6Months: {
        startDate: startOfDay(subMonths(today, 6)),
        endDate: endOfDay(subMonths(today, 1).setDate(subMonths(today, 1).getDate() - 1)), // day before lastMonth starts
      },
      thisYear: {
        startDate: startOfDay(startOfYear(today)),
        endDate: endOfDay(subMonths(today, 6).setDate(subMonths(today, 6).getDate() - 1)), // day before last6Months
      },
      older: {
        startDate: startOfDay(new Date("1970-01-01")),
        endDate: endOfDay(startOfYear(today).setDate(startOfYear(today).getDate() - 1)), // day before thisYear starts
      }
    };

    const results = {};

    for (const [key, { startDate, endDate }] of Object.entries(ranges)) {
      results[key] = await findReturnedBooksByUserAndDateRange(userid, startDate, endDate);
    }

    const allEmpty = Object.values(results).every((books) => books.length === 0);

    if (allEmpty) {
      return {};
    }

    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const handleGetBorrowedAndDueBooks = async (userid) => {
  try {
    const today = new Date();

    const ranges = {
      overdue: {
        startDate: new Date("1970-01-01"),
        endDate: subDays(startOfDay(today), 1),
      },
      today: {
        startDate: startOfDay(today),
        endDate: endOfDay(today),
      },
      next3Days: {
        startDate: startOfDay(addDays(today, 1)),
        endDate: endOfDay(addDays(today, 3)),
      }
    };

    const results = {};

    for (const [key, { startDate, endDate }] of Object.entries(ranges)) {
      results[key] = await findIssuedBooksByUserDueDateRange(userid, startDate, endDate);
    }

    // Fetch books due later (after 3 days)
    const after3Days = addDays(today, 3);
    results.dueLater = await findIssuedBooksByUserDueDateWithTIme(userid, endOfDay(after3Days));

    const allEmpty = Object.values(results).every((books) => books.length === 0);

    if (allEmpty) {
      return {}
    }

    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const checkUserBookStatus = async (userid, bookid) => {
  try {
    if (!bookid) {
      return "Invalid book ID";
    }

    const existingTransactionItem = await checkExistingTransaction(userid, bookid);
    if (existingTransactionItem) {
      return "Active transaction with this book.";
    }

    const cartItem = await findCartItem(userid, bookid);
    if (cartItem) {
      return "This book is already in your cart.";
    }

    return null; // no issues
  } catch (err) {
    return "Something went wrong while checking book status.";
  }
};