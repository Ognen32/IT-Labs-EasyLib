import { Router } from "express";
import {
  handleCreateBook,
  handleGetBookById,
  handlerGetAllBooks,
  handleUpdateBook,
  handleRemoveBook,
  handleGetBookBySlug,
} from "../controllers/bookController.js";
import {
    handleCreateGenre,
    handleGetGenres
  } from "../controllers/genreController.js";
import { uploadAvatar, uploadTwoCovers } from "../middlewares/multer.js";
import  cloudinary  from "../config/cloudinary.js";

const router = Router();

//  Или типовите на жанрови ќе ги внесваме во самата база каде што ќе биди полесно и одма ќе ги влечи или преку самата веб страница
router.post("/genre", handleCreateGenre);

//  Се добиваат сите жанрови што се внесени во самата база. Ова е потребно при внесување на самата книга. Да се види Book View.
router.get("/genres", handleGetGenres);

router.get("/books", handlerGetAllBooks);
router.get("/book/:slug", handleGetBookBySlug);
router.get("/book/:id", handleGetBookById);
router.put("/book/:id", handleUpdateBook);
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

export default router;
