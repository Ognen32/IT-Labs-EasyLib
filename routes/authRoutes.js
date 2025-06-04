import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, hanldeGetUserByIDHeader} from '../controllers/authController.js';
import { isAuthenticated } from "../middlewares/auth.js";

// For sending email requests via the POST, GET, PUT & DELETE methods

const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser); // Works
router.get('/logout', logoutUser); // Works
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.get('/userInfo', isAuthenticated, hanldeGetUserByIDHeader);
router.get('/isAuth', isAuthenticated, (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
  });

export default router;