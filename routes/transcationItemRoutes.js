import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handlerReturnedBooksByRanges, handlerBorrowedDueBooks} from "../controllers/transcationItemController.js";

const router = Router();

router.get("/transcation/myLibrary",isAuthenticated, handlerReturnedBooksByRanges);
router.get("/transcation/borrowedAndDue",isAuthenticated, handlerBorrowedDueBooks);

export default router;
