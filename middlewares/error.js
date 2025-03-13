class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    err.message = err.errors.map((e) => e.message).join(", ");
    err.statusCode = 400;
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    err.message = `Duplicate value entered for ${err.errors.map((e) => e.path).join(", ")}`;
    err.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid or expired token";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired, please login again";
    err.statusCode = 401;
  }

  if (err.name === "SequelizeConnectionError") {
    err.message = "Database connection error";
    err.statusCode = 500;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
};

export { ErrorHandler, errorMiddleware };