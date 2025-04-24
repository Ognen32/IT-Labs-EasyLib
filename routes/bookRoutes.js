import { Router } from "express";
import {
  addGenre,
  getGenres,
  addBook,
  getBooksBySearch,
  getBookBySlugController,
  removeBookByIdController,
  getBooksByIdController,
  editBookIdController,
  getLandingPageHandler,
  getFilteredLandingBooksHandler,
} from "../controllers/bookController.js";
import slugify from "slugify";
import { uploadAvatar, uploadTwoCovers } from "../middlewares/multer.js";
import cloudinary from "../config/cloudinarySetup.js";

const router = Router();

//  Или типовите на жанрови ќе ги внесваме во самата база каде што ќе биди полесно и одма ќе ги влечи или преку самата веб страница
router.post("/addGenre", addGenre);

//  Се добиваат сите жанрови што се внесени во самата база. Ова е потребно при внесување на самата книга. Да се види Book View.
router.get("/GenreAll", getGenres);

/*  Преку /addBook рутата ни овозможува да внесиме книга така што ги бара сите информации и нема да можи да се внеси без нив
    единсвтено можи да се нема жанра на книга и така да се внеси и овозможува на внесување на повеќе жанрови. Провевува исто
    така дали книгата е ако е тогаш враќа дека постој.  */
router.post("/addBook", uploadTwoCovers, addBook);

router.get("/books", getBooksBySearch);

router.get("/book/:slug", getBookBySlugController);
router.get("/book/edit/:bookid", getBooksByIdController);
router.patch("/book/edit/:bookid/edited", editBookIdController);

router.delete("/books/:bookid", removeBookByIdController);
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
