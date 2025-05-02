import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {handlerCartAdd} from '../controllers/CartController.js';

const router = Router();

router.post("/cart/add", isAuthenticated, handlerCartAdd);

export default router;
