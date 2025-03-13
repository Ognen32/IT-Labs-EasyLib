import cloudinary from "cloudinary";
import { findUserByEmail, findUserByUsernameOrEmail, createUser } from "../repositories/authRepository.js";
import { ErrorHandler } from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new ErrorHandler("User Avatar is Required!", 400));
        }

        const { avatar } = req.files;

        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(avatar.mimetype)) {
            return next(new ErrorHandler("Invalid file type. Use png, jpg, or webp.", 400));
        }

        const { username, email, password, firstName, surname, phoneNumber, dateOfBirth, gender, city, address, roles } = req.body;

        if (!username || !email || !password || !firstName || !surname || !phoneNumber || !dateOfBirth || !gender || !city || !address || !roles) {
            return next(new ErrorHandler("All fields are required!", 400));
        }

        const userExists = await findUserByUsernameOrEmail(username, email);
        if (userExists) {
            return next(new ErrorHandler("Username or Email already taken!", 400));
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Failed to upload avatar to Cloudinary!", 500));
        }

        const user = await createUser({
            username,
            email,
            password,
            firstName,
            surname,
            phoneNumber,
            dateOfBirth,
            gender,
            city,
            address,
            roles,
            avatarPublicId: cloudinaryResponse.public_id,
            avatarUrl: cloudinaryResponse.secure_url,
        });

        if (!user) {
            return next(new ErrorHandler("Failed to create user!", 500));
        }

        sendToken(user, 201, "User registered successfully!", res);
    } catch (error) {
        console.error("Error in registerUser:", error);
        next(new ErrorHandler(error.message, 500));
    }
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("All fields are required!", 400));
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return next(new ErrorHandler("Invalid email or password!", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password!", 400));
    }

    sendToken(user, 200, "User logged in successfully!", res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "User logged out successfully!",
        });
});