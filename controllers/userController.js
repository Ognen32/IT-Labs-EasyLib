import asyncHandler from "../utils/asyncHandler.js";
import { getUserById } from "../services/userService.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);
  res.json({
    message: "User profile retrieved successfully",
    user,
  });
});