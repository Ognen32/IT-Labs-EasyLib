export const sendToken = (user, statusCode, message, res) => {
  const token = user.getJWTToken(); // Getting JWT from the user model

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Cookie expiration time
    httpOnly: true, // Makes the cookie accessible only to HTTP requests, not JavaScript
  };

  res.status(statusCode)
    .cookie('token', token, options) // Send token as a cookie
    .json({
      success: true,
      user,
      message,
      token, // Return token in the response body
    });
};