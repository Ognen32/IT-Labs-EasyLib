export const sendToken = (user, statusCode, message, res) => {
    if (!user) {
        throw new ErrorHandler("User object is undefined", 500);
    }

    const token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token,
    });
};