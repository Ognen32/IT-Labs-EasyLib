import { registerUser, loginUser, logoutUser } from "../services/authService.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const register = catchAsyncErrors(registerUser);
export const login = catchAsyncErrors(loginUser);
export const logout = catchAsyncErrors(logoutUser);