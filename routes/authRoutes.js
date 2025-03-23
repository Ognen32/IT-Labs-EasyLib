import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } from '../controllers/authController.js';

// For sending email requests via the POST, GET, PUT & DELETE methods

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);

export default router;