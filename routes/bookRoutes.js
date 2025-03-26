import {Router} from 'express';
import {addGenre} from '../controllers/bookController.js';

const router = Router();

// Или типовите на жанрови ќе ги внесваме во самата база каде што ќе биди полесно и одма ќе ги влечи или преку самата веб страница
router.post("/addGenre", addGenre);


export default router