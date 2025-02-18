import { findUserByUsername, findUserByEmail, createUser } from '../repositories/userRepository.js';
import { sendToken } from '../utils/jwtToken.js';
import { ErrorHandler } from '../middlewares/error.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';

export const registerUserService = catchAsyncError(async (req, res, next) => {
  const { username, firstName, surname, email, password, dateOfBirth, gender, country, city, address, roles } = req.body;

  if (!username || !firstName || !surname || !email || !password || !dateOfBirth || !gender || !country || !city || !address || !roles) {
    return next(new ErrorHandler('All fields are required.', 400));
  }

  if (await findUserByUsername(username)) {
    return next(new ErrorHandler('Username is already taken. Please choose another one.', 400));
  }

  if (await findUserByEmail(email)) {
    return next(new ErrorHandler('User already exists with this email.', 400));
  }

  if (!['user', 'admin'].includes(roles)) {
    return next(new ErrorHandler('Invalid role. Only "user" and "admin" are allowed.', 400));
  }

  const user = await createUser({ username, firstName, surname, email, password, dateOfBirth, gender, country, city, address, roles });
  sendToken(user, 201, 'User registered successfully', res);
});

export const loginUserService = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('All fields are required.', 400));
  }

  const user = await findUserByEmail(email);
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorHandler('Invalid credentials.', 401));
  }

  sendToken(user, 200, 'Login successful', res);
});

export const logoutUserService = catchAsyncError(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});