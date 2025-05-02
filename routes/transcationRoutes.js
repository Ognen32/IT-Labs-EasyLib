import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {handlerBuyNow, handleGetPendingTransactions} from '../controllers/transcationController.js';

const router = Router();

router.post("/transcation/buyNow", isAuthenticated, handlerBuyNow);
router.get('/transcation/pending-transactions', handleGetPendingTransactions);

export default router;
