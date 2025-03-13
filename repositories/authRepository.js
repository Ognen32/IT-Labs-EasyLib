import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";
import { ErrorHandler } from "../middlewares/error.js";

export const findUserByEmail = catchAsyncErrors(async (email) => {
    return await User.findOne({ where: { email } });
});

export const findUserByUsernameOrEmail = catchAsyncErrors(async (username, email) => {
    return await User.findOne({
        where: {
            [Op.or]: [{ username }, { email }],
        },
    });
});

export const createUser = catchAsyncErrors(async (userData) => {
    try {
        const user = await User.create(userData);
        if (!user) {
            throw new ErrorHandler("Failed to create user!", 500);
        }
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new ErrorHandler(error.message, 500);
    }
});