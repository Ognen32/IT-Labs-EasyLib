import {handleBuyNow, getPendingTransactions} from '../services/transactionService.js';

export const handlerBuyNow = async (req, res) => {
    try {
    const bookid = req.body.bookid;
    const userid = req.user.id;
    const answer = await handleBuyNow(userid, bookid);
    res.status(201).json({answer: "good"});
}  catch (err) {
    res.status(500).json({ error: err.message });
    } 
};

export const handleGetPendingTransactions = async (req, res) => {
    try {
      // Optionally: check if req.user.role === 'admin'
      const transactions = await getPendingTransactions();
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };