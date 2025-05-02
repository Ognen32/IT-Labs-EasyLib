import { Op } from "sequelize"; // Import Op for Sequelize operators
import TransactionItem from "../models/transactionItemModel.js";
import Transaction from "../models/transcationModel.js";

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
