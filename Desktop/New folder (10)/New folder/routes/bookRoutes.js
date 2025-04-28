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
} from "../controllers/bookController.js";
import {
  handleCreateGenre,
  handleGetGenres,
} from "../controllers/genreController.js";
import { uploadAvatar, uploadTwoCovers } from "../middlewares/multer.js";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/genre", asyncHandler(handleCreateGenre));
router.get("/genres", asyncHandler(handleGetGenres));

router.get("/books", handlerGetAllBooks);
router.get("/book/:slug", handleGetBookBySlug);
router.get("/book/:id", handleGetBookById);
router.patch("/book/:id", handleUpdateBook);
router.post("/book", uploadTwoCovers, handleCreateBook);
router.delete("/books/:bookid", handleRemoveBook);
router.post("/books/test/avatars", uploadAvatar, async (req, res) => {
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
router.get("/landingPage", getLandingPageHandler);
router.post("/landingPage/search", getFilteredLandingBooksHandler);

export default router;
