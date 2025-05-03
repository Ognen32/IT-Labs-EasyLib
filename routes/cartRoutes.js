import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {handlerCartAdd, handlerCartItems, handlerCartSubmit} from '../controllers/CartController.js';

const router = Router();

router.post("/cart/add", isAuthenticated, handlerCartAdd);
router.get("/cart", isAuthenticated, handlerCartItems);
router.post("/cart/submit", isAuthenticated, handlerCartSubmit);

export default router;
