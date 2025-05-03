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
          attributes: ["id", "userName"],
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
          attributes: ["id"], 
        },
      ],
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
