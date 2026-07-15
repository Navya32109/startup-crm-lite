import express from 'express';
import { body } from 'express-validator';

// Controllers
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads
} from '../controllers/leadController.js';

// Middlewares
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// ==========================================
// Validation Schemas
// ==========================================

const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value'),
  
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Invalid source value'),

  body('value')
    .optional()
    .isNumeric().withMessage('Pipeline deal value must be a number'),

  body('notes')
    .optional()
    .custom(val => Array.isArray(val) || typeof val === 'string')
    .withMessage('Notes must be a string or an array')
];

const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  
  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company cannot be empty'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value'),
  
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Invalid source value'),

  body('value')
    .optional()
    .isNumeric().withMessage('Pipeline deal value must be a number'),

  body('notes')
    .optional()
    .custom(val => Array.isArray(val) || typeof val === 'string')
    .withMessage('Notes must be a string or an array')
];

const updateLeadStatusValidation = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value')
];

// ==========================================
// Route Declarations
// ==========================================

/**
 * @route   GET /api/leads/stats
 * @desc    Get aggregated lead metrics for user dashboard
 * @access  Private (Protected)
 */
router.get('/stats', getLeadStats);

/**
 * @route   GET /api/leads/stats/summary
 * @desc    Alias of /stats
 * @access  Private (Protected)
 */
router.get('/stats/summary', getLeadStats);

/**
 * @route   GET /api/leads/monthly-stats
 * @desc    Get monthly lead totals and wins over past 6 months
 * @access  Private (Protected)
 */
router.get('/monthly-stats', getMonthlyStats);

/**
 * @route   GET /api/leads/stats/monthly
 * @desc    Alias of /monthly-stats
 * @access  Private (Protected)
 */
router.get('/stats/monthly', getMonthlyStats);

/**
 * @route   GET /api/leads
 * @desc    Get paginated, filtered, and searchable leads list
 * @access  Private (Protected)
 */
router.get('/', getLeads);

/**
 * @route   POST /api/leads
 * @desc    Create a new lead document
 * @access  Private (Protected)
 */
router.post('/', validate(createLeadValidation), createLead);

/**
 * @route   GET /api/leads/search
 * @desc    Quick autocomplete search for leads
 * @access  Private (Protected)
 */
router.get('/search', searchLeads);

/**
 * @route   GET /api/leads/:id
 * @desc    Get details of a specific lead by ID
 * @access  Private (Protected)
 */
router.get('/:id', getLeadById);

/**
 * @route   PUT /api/leads/:id
 * @desc    Update lead fields
 * @access  Private (Protected)
 */
router.put('/:id', validate(updateLeadValidation), updateLead);

/**
 * @route   PATCH /api/leads/:id/status
 * @desc    Specifically update only the status of a lead
 * @access  Private (Protected)
 */
router.patch('/:id/status', validate(updateLeadStatusValidation), updateLeadStatus);

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead document
 * @access  Private (Protected)
 */
router.delete('/:id', deleteLead);

export default router;
