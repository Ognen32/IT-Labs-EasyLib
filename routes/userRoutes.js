import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController.js';

// For sending email requests via the POST, GET, PUT & DELETE methods

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

export default router;