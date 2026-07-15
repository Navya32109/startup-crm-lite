import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Helper function to generate a JWT token for a specific user ID.
 * Uses the secret and expires_in configurations from environment variables.
 * 
 * @param {string} userId - The MongoDB ID of the user.
 * @returns {string} Signed JWT.
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Registers a new user in the CRM system.
 * 
 * NOTE FOR PRODUCTION: 
 * This endpoint should be protected against automation/abuse by adding rate-limiting middleware,
 * e.g., 'express-rate-limit' should be mounted in front of this route in server.js or authRoutes.js.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create the new User document
    // The password will be automatically hashed by User model pre-save middleware
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token (standard register token is signed for 7 days)
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Convert to JSON to strip password via custom toJSON override
    const userJson = user.toJSON();

    return res.status(201).json({
      success: true,
      token,
      user: userJson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates an existing user and returns a session JWT.
 * 
 * NOTE FOR PRODUCTION:
 * To prevent brute-force attacks on user credentials, mount 'express-rate-limit' 
 * on this endpoint to limit login attempts from a single IP.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user and explicitly include password field
    const user = await User.findOne({ email }).select('+password');

    // Return generic error message for security reasons if user not found or password wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if the user's account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate session JWT token
    const token = generateToken(user._id);

    // Convert to JSON to strip password via custom toJSON override
    const userJson = user.toJSON();

    return res.status(200).json({
      success: true,
      token,
      user: userJson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the profile details of the currently authenticated user.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is populated by 'protect' middleware (without password field)
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates details of the currently authenticated user.
 * Allows updating the 'name' field, and handles secure 'password' updates.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, password } = req.body;
    
    // Retrieve full user record (including current password hash for validation)
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    // Allow updating name only (email changes are ignored as they require a verification flow)
    if (name) {
      user.name = name;
    }

    // Process password update if a new password is provided
    if (password) {
      // Must provide old password to complete password updates
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: 'Old password is required to change password'
        });
      }

      // Verify the old password first
      const isOldPasswordMatch = await user.comparePassword(oldPassword);
      if (!isOldPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid old password'
        });
      }

      // Assign new password (will be automatically hashed in pre-save middleware)
      user.password = password;
    }

    // Save user changes to database
    await user.save();

    // Convert user document to JSON (automatically strips password field)
    const updatedUserJson = user.toJSON();

    return res.status(200).json({
      success: true,
      user: updatedUserJson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Invalidates user session / clears authentication state (Logout helper).
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
