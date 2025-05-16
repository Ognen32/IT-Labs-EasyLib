import {
  handleBuyNow,
  getPendingTransactions,
  handleConfirmTransaction,
  getIssuedTransactions,
  handleCancelTransaction,
  handleConfirmReturn,
} from "../services/transactionService.js";

export const handlerBuyNow = async (req, res) => {
  try {
    const bookid = req.body.bookid;
    const userid = req.user.id;
    const answer = await handleBuyNow(userid, bookid);
    res.status(201).json({ answer: "good" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetPendingTransactions = async (req, res) => {
  try {
    // Optionally: check if req.user.role === 'admin'
    const transactions = await getPendingTransactions();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const handlerConfirmTransaction = async (req, res) => {
  try {
    const transactionid = req.body.transactionid;
    const transaction = await handleConfirmTransaction(transactionid);
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleIssuedTransactions = async (req, res) => {
  try {
    // Optionally: check if req.user.role === 'admin'
    const transactions = await getIssuedTransactions();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const handlerCancelTransaction = async (req, res) => {
  try {
    const transactionid = req.body.transactionid;
    const transaction = await handleCancelTransaction(transactionid);
    res.status(200).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const handlerConfirmReturn = async (req, res) => {
  try {
    const transactionid = req.body.transactionid;
    const transaction = await handleConfirmReturn(transactionid);
    res.status(200).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
