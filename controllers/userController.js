import catchAsyncError from '../middlewares/catchAsyncError.js';
import { registerUserService, loginUserService, logoutUserService } from '../services/userService.js';

// Used for handling up the services's API request & response logic

export const registerUser = catchAsyncError(registerUserService);
export const loginUser = catchAsyncError(loginUserService);
export const logoutUser = catchAsyncError(logoutUserService);