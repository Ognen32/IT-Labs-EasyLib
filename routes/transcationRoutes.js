import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {handlerBuyNow, handleGetPendingTransactions, handlerConfirmTransaction, handleIssuedTransactions, handlerCancelTransaction, handlerConfirmReturn, handleCheckBookStatus} from '../controllers/transcationController.js';

const router = Router();
router.post('/books/check-status', isAuthenticated, handleCheckBookStatus);
router.post("/transcation/buyNow", isAuthenticated, handlerBuyNow);
router.get('/transcation/pending-transactions', isAuthenticated, isAuthorized("admin"),  handleGetPendingTransactions);
router.post('/transcation/pending-transactions/confirm', isAuthenticated, isAuthorized("admin") , handlerConfirmTransaction);
router.post('/transcation/pending-transactions/cancel', isAuthenticated, isAuthorized("admin"), handlerCancelTransaction);
router.get('/transcation/issued-transactions', isAuthenticated, isAuthorized("admin"),  handleIssuedTransactions);
router.post('/transcation/issued-transactions/confirm', handlerConfirmReturn);


export default router;
