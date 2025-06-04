import { Router } from "express";
import {
  handletoggleFavouriteBook,
  handleGetFavouriteBooks,
  getSortedFavouritesHanlder,
  handleCheckFavouriteBook
} from "../controllers/favouriteBookController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();


router.post("/favourite/check", isAuthenticated,asyncHandler(handleCheckFavouriteBook));
router.post("/favourite", isAuthenticated, asyncHandler(handletoggleFavouriteBook)); // Works
router.get("/favourites", isAuthenticated, asyncHandler(handleGetFavouriteBooks)); // Works
router.get("/sortedFavourites", isAuthenticated, getSortedFavouritesHanlder); // Works
// Need to add remove favourite
export default router;
