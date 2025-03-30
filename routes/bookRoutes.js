import {Router} from 'express';
import {addGenre, getGenres, addBook, getBooksBySearch, getBookBySlugController} from '../controllers/bookController.js';
import slugify from "slugify";

const router = Router();

//  Или типовите на жанрови ќе ги внесваме во самата база каде што ќе биди полесно и одма ќе ги влечи или преку самата веб страница
    router.post("/addGenre", addGenre);

//  Се добиваат сите жанрови што се внесени во самата база. Ова е потребно при внесување на самата книга. Да се види Book View.
    router.get("/GenreAll", getGenres);

  
/*  Преку /addBook рутата ни овозможува да внесиме книга така што ги бара сите информации и нема да можи да се внеси без нив
    единсвтено можи да се нема жанра на книга и така да се внеси и овозможува на внесување на повеќе жанрови. Провевува исто
    така дали книгата е ако е тогаш враќа дека постој.  */
    router.post("/addBook", addBook);

    router.get("/books", getBooksBySearch);

    router.get("/book/:slug", getBookBySlugController);

export default router