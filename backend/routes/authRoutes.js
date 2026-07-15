import express from 'express';
import { body } from 'express-validator';

// Controllers
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout
} from '../controllers/authController.js';

// Middlewares
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// ==========================================
// Validation Schemas
// ==========================================

// Input validations for user registration
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters long'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Input validations for user login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Input validations for optional profile updates
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters long'),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// ==========================================
// Route Declarations
// ==========================================

// NOTE FOR PRODUCTION: To protect auth endpoints against brute-force and DDoS, 
// mount rate-limiting middleware (such as 'express-rate-limit') on /register and /login routes.

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/register', validate(registerValidation), register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate credentials and return session token
 * @access  Public
 */
router.post('/login', validate(loginValidation), login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get profile details of the logged in user
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update profile info (name, change password)
 * @access  Private
 */
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear session state/invalidate cookie authentication
 * @access  Private
 */
router.post('/logout', protect, logout);

export default router;
