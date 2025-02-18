import jwt from 'jsonwebtoken';

// Process.env are defined in the dotenv config file
// This is a function for generating and sending jwt tokens
// Using a secret signing key for the user with their data
// When registering, logging in or out with an expiration date

export const sendToken = (user, statusCode, message, res) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    },
    process.env.JWT_SECRET, // The secret signing key
    { expiresIn: process.env.JWT_EXPIRES } // Token expiration time in milliseconds
  );

// An option for storing the token

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Token expiration milliseconds multiplied to equal 5 days
    httpOnly: true, // Prevents access to the stored token via the browser
  };

// Checks the status of the stored or created token and depending on the business logic
// It returns a json response with the user's data

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    user,
    message,
    token,
  });
};