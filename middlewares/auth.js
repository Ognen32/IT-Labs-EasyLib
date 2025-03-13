import { verifyToken } from '../utils/jwtToken.js';
import { ErrorHandler } from '../middlewares/error.js';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ErrorHandler('Authentication required. Please log in.', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 401));
  }
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.roles)) {
      return next(
        new ErrorHandler(
          `User with this role (${req.user?.roles}) is not allowed to access this resource`
        )
      );
    }
    next();
  };
};