import {handleGetReturnedBooksByDateRanges} from "../services/transactionService.js";


export const handlerReturnedBooksByRanges = async (req, res) => {
    try {
      const userid = req.user.id; // assuming user is authenticated and req.user exists
      const booksByRanges = await handleGetReturnedBooksByDateRanges(userid); // this is the service
      res.status(200).json(booksByRanges);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  