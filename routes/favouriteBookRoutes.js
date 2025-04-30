import { Router } from "express";
import {
  handleAddFavouriteBook,
  handleGetFavouriteBooks,
  getSortedFavouritesHanlder,
} from "../controllers/favouriteBookController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/favourite", isAuthenticated, asyncHandler(handleAddFavouriteBook)); // Works
router.get("/favourites", isAuthenticated, asyncHandler(handleGetFavouriteBooks)); // Works
router.get("/sortedFavourites", isAuthenticated, getSortedFavouritesHanlder); // Works
// Need to add remove favourite
export default router;
