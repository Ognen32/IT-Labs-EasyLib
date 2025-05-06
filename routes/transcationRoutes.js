import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {handlerBuyNow, handleGetPendingTransactions, handlerConfirmTransaction, handleIssuedTransactions, handlerCancelTransaction, handlerConfirmReturn} from '../controllers/transcationController.js';

const router = Router();

router.post("/transcation/buyNow", isAuthenticated, handlerBuyNow);
router.get('/transcation/pending-transactions', handleGetPendingTransactions);
router.get('/transcation/pending-transactions/confirm', handlerConfirmTransaction);
router.get('/transcation/pending-transactions/cancel', handlerCancelTransaction);
router.get('/transcation/issued-transactions', handleIssuedTransactions);
router.get('/transcation/issued-transactions/confirm', handlerConfirmReturn);


export default router;
