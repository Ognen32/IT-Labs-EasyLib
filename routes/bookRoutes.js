import { Router } from "express";
import {
  handleCreateBook,
  handleGetBookById,
  handlerGetAllBooks,
  handleUpdateBook,
  handleRemoveBook,
  handleGetBookBySlug,
  getLandingPageHandler,
  getFilteredLandingBooksHandler,
  getLatestBooksHanlder,
} from "../controllers/bookController.js";
import {
  handleCreateGenre,
  handleGetGenres,
} from "../controllers/genreController.js";
import { uploadAvatar, uploadTwoCovers } from "../middlewares/multer.js";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = Router();

router.post("/genre", asyncHandler(handleCreateGenre)); // Works
router.get("/genres", asyncHandler(handleGetGenres)); // Works

router.get("/books", handlerGetAllBooks); // Works needs to be updated for searching via genres. Copy the logic from landing page with its search
router.get("/book/:slug", handleGetBookBySlug); // Works
router.get("/bookot/:bookid", handleGetBookById); // Works
router.patch("/book/:id", handleUpdateBook); // Works But if it required we can add some small layer of validaton with the genres but it will not be required for now.
router.post("/book", isAuthenticated, isAuthorized("admin"),  uploadTwoCovers, handleCreateBook); //Works perfectly but the front-end must add some validation before posting
router.delete("/books/:bookid", handleRemoveBook); // Works
router.post("/books/test/avatars", uploadAvatar, async (req, res) => {
  // Testing
  try {
    const file = req.file;
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const title = req.body.title;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "Test",
      public_id: `test_${Date.now()}`,
      resource_type: "image",
      format: "webp",
    });
    res.json(result);
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/landingPage", getLandingPageHandler); // Works
router.post("/landingPage/search", getFilteredLandingBooksHandler); // Works as indendent
router.get("/latestBooks", getLatestBooksHanlder);

export default router;
