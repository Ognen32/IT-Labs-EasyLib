import { Op } from "sequelize"; // Import Op for Sequelize operators
import TransactionItem from "../models/transactionItemModel.js";
import Transaction from "../models/transcationModel.js";
import Book from "../models/bookModel.js";

export const checkExistingTransaction = async function (userid, bookid) {
  try {
    // Find any TransactionItem that matches the userid and bookid
    const existingTransactionItem = await TransactionItem.findOne({
      where: {
        bookid: bookid,
      },
      include: {
        model: Transaction, // We include the Transaction model to check its status
        where: {
          userid: userid, // User should match
          status: {
            [Op.or]: ["pending", "approved", "issued"], // Active transaction statuses
          },
        },
        required: true, // Ensure the join must have matching transactions
      },
    });

    return existingTransactionItem; // If it finds a transaction item, return it
  } catch (err) {
    throw new Error(err.message);
  }
};

export const createTranscationItem = async function (transactionid, bookid) {
  try {
    const transactionItem = await TransactionItem.create({
      transactionid: transactionid,
      bookid: bookid,
    });
    return transactionItem;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const findReturnedBooksByUserAndDateRange = async function (userid, startDate, endDate) {
  try {
    const myLibrary = await TransactionItem.findAll({
      attributes: ["id", "bookid"],
      include: [
        {
          model: Book,
          attributes: ["bookid", "title", "author", "slug", "coverArt"]
        },
        {
          model: Transaction,
          attributes: ["id","userid","returnedDate"],
          where: {
            userid: userid,
            status: "returned",
            returnedDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
    });
    return myLibrary;
  } catch (err) {
    throw new Error(err.message);
  }
};
