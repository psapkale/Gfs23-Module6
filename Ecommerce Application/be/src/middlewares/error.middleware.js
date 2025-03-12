import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Handle Mongoose validation errors
const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => error.message);
  return new ApiError(400, 'Validation Error', errors);
};

// Handle Mongoose duplicate key errors
const handleMongooseDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  return new ApiError(409, `Duplicate ${field} value`);
};

// Handle Mongoose cast errors
const handleMongooseCastError = (err) => {
  return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
};

// Handle JWT errors
const handleJWTError = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return new ApiError(401, 'Token expired');
  }
  return new ApiError(401, 'Authentication failed');
};

// Handle multer errors
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new ApiError(400, 'File size too large');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new ApiError(400, 'Too many files');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new ApiError(400, 'Unexpected file type');
  }
  return new ApiError(400, 'File upload error');
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle different types of errors
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'ValidationError') {
    error = handleMongooseValidationError(err);
  } else if (err.code === 11000) {
    error = handleMongooseDuplicateKeyError(err);
  } else if (err.name === 'CastError') {
    error = handleMongooseCastError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  } else if (err.name === 'MulterError') {
    error = handleMulterError(err);
  }

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack
    });
    return;
  }

  // Production error response
  if (error.isOperational) {
    res.status(error.statusCode).json(
      new ApiResponse(error.statusCode, null, error.message)
    );
    return;
  }

  // Programming or unknown errors
  console.error('ERROR 💥', error);
  res.status(500).json(
    new ApiResponse(500, null, 'Something went wrong!')
  );
};

// Handle 404 errors
export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

// Handle async errors
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 