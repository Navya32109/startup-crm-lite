import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication protector middleware.
 * Verifies the JWT token from the Authorization header and attaches the user object to the request.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const protect = async (req, res, next) => {
  let token;

  // Extract the token from the Authorization header (expected format: 'Bearer <token>')
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If token missing: 401 "No token provided, access denied"
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, access denied'
    });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve the user from the database using the decoded ID (exclude the password field)
    const user = await User.findById(decoded.id).select('-password');
    
    // If user not found: 401 "User belonging to this token no longer exists"
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next();
  } catch (error) {
    // If token expired: 401 "Token has expired, please login again"
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired, please login again'
      });
    }

    // If token invalid: 401 "Token is invalid"
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }

    // Call next(error) on unexpected database or other system failures
    next(error);
  }
};

export default protect;
