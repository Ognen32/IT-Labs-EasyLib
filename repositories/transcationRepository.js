import Transcation from "../models/transcationModel.js";
import TranscationItem from "../models/transactionItemModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";

export const createTranscation = async function (
  userid,
  issueDate,
  expirationDate
) {
  try {
    const transcation = await Transcation.create({
      userid: userid,
      issueDate: issueDate,
      expirationDate: expirationDate,
    });
    return transcation;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findAllActivePendingTransactions = async (now) => {
  try {
    const transactions = await Transcation.findAll({
      where: {
        status: "pending",
        expirationDate: {
          [Op.gte]: now, // Passed-in date instead of using new Date() inside
        },
      },
      include: [
        {
          model: TranscationItem,
          include: [
            {
              model: Book,
              attributes: ["title", "author", "coverArt"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "userName", "avatar"],
        },
      ],
      order: [["expirationDate", "ASC"]],
    });

    return transactions;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findExpiredPendingTransactions = async (now) => {
  try {
    return await Transcation.findAll({
      where: {
        status: "pending",
        expirationDate: {
          [Op.lt]: now,
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "limit"],
        },
        {
          model: TranscationItem,
          attributes: ["id", "bookid"],
        },
      ],
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const confirmTransaction = async function (
  transactionid,
  borrowedDate,
  dueDate
) {
  try {
    const transaction = await Transcation.update(
      {
        status: "issued",
        borrowedDate: borrowedDate,
        dueDate: dueDate,
      },
      {
        where: { id: transactionid },
      }
    );
    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};



export const findAllIssuedTransactions = async () => {
  try {
    const transactions = await Transcation.findAll({
      where: {
        status: "issued",
      },
      include: [
        {
          model: TranscationItem,
          include: [
            {
              model: Book,
              attributes: ["title", "author", "coverArt"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "userName", "email", "phoneNumber", "city", "address", "avatar", "firstName", "surName"  ],
        },
      ],
      order: [["borrowedDate", "ASC"]],
    });

    return transactions;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const findTransactionsByPKPending = async function (transactionid) {
  try {
    const transaction = await Transcation.findOne({
      where: {
        id: transactionid,
        status: "pending"
      },
      include: [
        {
          model: TranscationItem,
          attributes: ["id", "bookid"],
        },
        {
          model: User,
          attributes: ["id", "limit", ],
        }
      ]
    });

    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findTransactionsByPKIssued = async function (transactionid) {
  try {
    const transaction = await Transcation.findOne({
      where: {
        id: transactionid,
        status: "issued"
      },
      include: [
        {
          model: TranscationItem,
          attributes: ["id", "bookid"],
        },
        {
          model: User,
          attributes: ["id", "limit"],
        }
      ]
    });

    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};