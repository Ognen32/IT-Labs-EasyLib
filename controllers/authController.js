import { registerUser, authenticateUser } from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler (async (req, res) => {
        const { username, email, password } = req.body;
        const user = await registerUser(username, email, password);
        res.status(201).json({ message: "User registered successfully", user });
});


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    const token = await authenticateUser(email, password);
  
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token
    });
  });