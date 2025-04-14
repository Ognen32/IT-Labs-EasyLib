import catchAsyncError from "../middlewares/catchAsyncError.js";
import {
  forgotPasswordService,
  resetPasswordService,
  registerUserService,
  loginUserService,
  logoutUserService,
} from "../services/authService.js";

// Used for handling up the services's API request & response logic
export const registerUser = catchAsyncError(async (req, res, next) => {
  const {
    userName,
    email,
    phoneNumber,
    firstName,
    surName,
    password,
    role,
    dateOfBirth,
    city,
    address,
  } = req.body;
  await registerUserService(req, res); // Calls the service to handle the registry
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // checks if both are entered
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  await loginUserService(req, res, next); // Calls the service to handle the login
});

export const logoutUser = catchAsyncError(async (_req, res) => {
  await logoutUserService(_req, res); // Calls the service to handle the logout
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  await forgotPasswordService(req, res, next); // Calls the service and requests email in order to send a password reset link
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params; // requests the token
  const { password } = req.body; // requests the password
  await resetPasswordService(req, res, next);
});
