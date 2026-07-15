import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express error handling middleware.
 * Intercepts various application errors (Mongoose validation, MongoDB duplicate keys, JWT errors, CastError)
 * and formats them into a consistent JSON error response structure.
 * 
 * @param {Error} err - Error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Server error';
  let errors = null;

  // Log error details for the developer if in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  }

  // 1. Mongoose ValidationError (field-by-field validation failures)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  // 2. Mongoose CastError (invalid MongoDB ObjectId format)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // 3. MongoDB Duplicate Key Error (Code 11000, e.g. duplicate email)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }
  // 4. JWT Errors: Invalid or Expired Web Token
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' 
      ? 'Token has expired. Please log in again.' 
      : 'Invalid token. Please authenticate again.';
  }
  // 5. Handles other explicit errors (with custom statusCode set by controller/middleware)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || 'Server error';
  }

  // Formulate the error structure to return to client
  // In development, include the stack trace; in production, never include it.
  const isDev = process.env.NODE_ENV === 'development';
  
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(isDev && { stack: err.stack })
  });
};

export default errorHandler;
