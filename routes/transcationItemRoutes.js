import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handlerReturnedBooksByRanges } from "../controllers/transcationItemController.js";

const router = Router();

router.get("/transcation/myLibrary",isAuthenticated, handlerReturnedBooksByRanges);

export default router;
