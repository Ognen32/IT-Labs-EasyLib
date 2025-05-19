import { findUserByUserName, findUserByEmail, findUserByPhoneNumber, createUser, findUserByResetPasswordToken, updateUserPassword, findUserById } from '../repositories/authRepository.js';
import { sendToken } from '../utils/jwtToken.js';
import { ErrorHandler } from '../middlewares/error.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import { ValidationError } from "../utils/error.js";

export const registerUserService = async (req, res, next) => {
  try {
    const userData = req.body; // Defining required field data
    const requiredFields = ['userName', 'email', 'phoneNumber', 'firstName', 'surName', 'password', 'role', 'dateOfBirth', 'city', 'address'];

    if (requiredFields.some(field => !userData[field])) { // Checks if all fields are filled
      return next(new ErrorHandler('All fields are required.', 400));
    }

    // Checks if username, email or phone number already exist in the DB
    const checks = [
      { fn: findUserByUserName, msg: 'Username is already taken. Please choose another one.' },
      { fn: findUserByEmail, msg: 'User already exists with this email.' },
      { fn: findUserByPhoneNumber, msg: 'User already exists with this phone number.' }
    ];

    for (const { fn, msg } of checks) {
      if (await fn(userData[fn.name.includes('UserName') ? 'userName' : fn.name.includes('Email') ? 'email' : 'phoneNumber'])) {
        return next(new ErrorHandler(msg, 400)); // Returns an error message that one of the checked constants already exists
      }
    }

    if (!['user', 'admin'].includes(userData.role)) { // Checks for the role type but defaults to user as via the model
      return next(new ErrorHandler('Invalid role. Only "user" and "admin" are allowed.', 400));
    } // Otherwise checks if the role exists as per postman testing

    const user = await createUser(userData); // If everything is okay it takes the data and creates a new user in the DB
    sendToken(user, 201, 'User registered successfully', res);
  } catch (error) {
    next(error);
  }
};

export const loginUserService = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler('All fields are required.', 400));

    // Check if the user email exists
    const user = await findUserByEmail(email);
    if (!user || !(await user.matchPassword(password))) { // Matches the password with the hashed one in the DB
      return next(new ErrorHandler('Invalid credentials.', 401));
    }

    sendToken(user, 200, 'Login successful', res);
  } catch (error) {
    next(error);
  }
};

// Clears the cookies memory in order to log the user out
export const logoutUserService = async (_req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const forgotPasswordService = async (req, res, next) => {
  const { email } = req.body;

  // Checks if the user email exists in the DB
  const user = await findUserByEmail(email);
  if (!user) {
    return next(new ErrorHandler('User not found with this email address.', 404));
  }

  // Generates reset password reset token
  const resetToken = user.getResetPasswordToken();
  // Saves the reset token to the database with it's expiry time
  await user.save({ validate: false });
  // Reset password link for postman testing
  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetToken}`;
  // Create the email message with the reset password URL
  const message = `You have requested a password reset. Click the following link to reset your password: \n\n${resetPasswordUrl}\n\nIf you did not request a password reset, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email} successfully.`,
    });
  } catch (error) {
    // Clear the reset token and expiration time if sendEmail fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validate: false });

    return next(new ErrorHandler('Failed to send email. Try again later.', 500));
  }
};

export const resetPasswordService = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Check if password is provided
    if (!password) {
      return next(new ErrorHandler('Password is required.', 400));
    }

    // Validate password length
    if (password.length < 8 || password.length > 16) {
      return next(new ErrorHandler('Password must be between 8 and 16 characters.', 400));
    }

    // Hash the token received in the URL to match the hashed token in the database
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by the hashed reset password token in the database
    const user = await findUserByResetPasswordToken(resetPasswordToken);

    if (!user) {
      return next(new ErrorHandler('Invalid reset token.', 400));
    }

    // Check if the reset token has expired
    if (user.resetPasswordExpire < Date.now()) {
      return next(new ErrorHandler('Reset token has expired.', 400));
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear the password reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the updated user
    await user.update(
      { password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpire: undefined },
      { where: { id: user.id }, validate: false }
    );

    sendToken(user, 200, 'Password reset successfully.', res);
  } catch (error) {
    next(error);
  }
};

export const getUserByIDHeader = async (userid) => {
  try {
    if (!userid) {
      throw new ValidationError("Must Enter userid!");
    }
    const user = await findUserById(userid);
    if (!user) {
      throw new ValidationError("User has not been found!");
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}