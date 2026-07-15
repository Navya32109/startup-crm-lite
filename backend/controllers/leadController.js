import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * Get all leads for the authenticated user with sorting, custom pagination, and dynamic search/filter parameters.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends success response with leads and pagination metadata.
 */
export const getLeads = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status, 
      search, 
      source,
      dateFrom,
      dateTo
    } = req.query;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - getLeads] User ID: ${req.user._id} | Query Params:`, req.query);
    }

    // Always filter by owner
    const filter = { owner: req.user._id };

    // Filter by status if provided and not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Filter by source if provided and not 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Filter by search terms if provided (name, company, email) using $regex with case-insensitive option
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by date range on createdAt if provided
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Parse pagination parameters
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Define sort configuration
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Retrieve data and total count concurrently
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(limitNum),
      Lead.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limitNum) || 1;
    const hasNext = pageNum < pages;
    const hasPrev = pageNum > 1;

    return res.status(200).json({
      success: true,
      message: 'Leads retrieved successfully',
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - getLeads Error]:', error);
    }
    next(error);
  }
};

/**
 * Creates a new lead document in the database associated with the logged in user.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends 201 successResponse with the created lead.
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - createLead] User ID: ${req.user._id} | Body:`, req.body);
    }

    const { name, company, email, phone, status, source, notes, value } = req.body;

    let notesArray = [];
    if (notes) {
      if (Array.isArray(notes)) {
        notesArray = notes;
      } else if (typeof notes === 'string') {
        notesArray = [
          {
            id: `n-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            text: notes,
            author: 'System'
          }
        ];
      }
    }

    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes: notesArray,
      value,
      owner: req.user._id
    });

    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - createLead Error]:', error);
    }
    next(error);
  }
};

/**
 * Retrieves a single lead document by ID, checking that it belongs to the authenticated user.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends successResponse with the lead, or 404 errorResponse.
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - getLeadById] User ID: ${req.user._id} | Lead ID: ${req.params.id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - getLeadById Error]:', error);
    }
    next(error);
  }
};

/**
 * Updates a single lead document by ID, preventing owner changes and running validators.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends successResponse with the updated lead, or 404 errorResponse.
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - updateLead] User ID: ${req.user._id} | Lead ID: ${req.params.id} | Body:`, req.body);
    }

    // Explicitly exclude changing the owner field
    const { owner, ...updateFields } = req.body;

    // Convert notes to array structure if passed as a string during updates
    if (updateFields.notes && typeof updateFields.notes === 'string') {
      updateFields.notes = [
        {
          id: `n-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          text: updateFields.notes,
          author: 'System'
        }
      ];
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateFields,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - updateLead Error]:', error);
    }
    next(error);
  }
};

/**
 * Updates only the status field of a lead. Strictly validates input status.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends successResponse with the updated lead.
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - updateLeadStatus] User ID: ${req.user._id} | Lead ID: ${req.params.id} | Body:`, req.body);
    }

    // Validate that only status is passed in req.body
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length !== 1 || !bodyKeys.includes('status')) {
      return errorResponse(res, 'Only status update is allowed at this endpoint', 400);
    }

    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid lead status value', 400);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead status updated successfully');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - updateLeadStatus Error]:', error);
    }
    next(error);
  }
};

/**
 * Deletes a lead document from the database if owned by the authenticated user.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends 200 status with a message of deletion success.
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - deleteLead] User ID: ${req.user._id} | Lead ID: ${req.params.id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - deleteLead Error]:', error);
    }
    next(error);
  }
};

/**
 * Aggregates statistics about leads owned by the user (total, won, lost, status counts, conversion rate).
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends successResponse with aggregated stats object.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - getLeadStats] User ID: ${req.user._id}`);
    }

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // 1-indexed

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth() + 1; // 1-indexed

    // Perform a single MongoDB aggregation query with $facet
    const results = await Lead.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                wonLeads: {
                  $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] }
                },
                thisMonthLeads: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: [{ $year: '$createdAt' }, thisYear] },
                          { $eq: [{ $month: '$createdAt' }, thisMonth] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                },
                lastMonthLeads: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: [{ $year: '$createdAt' }, lastYear] },
                          { $eq: [{ $month: '$createdAt' }, lastMonth] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ],
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceBreakdown: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const facet = results[0] || {};
    const summary = (facet.summary && facet.summary[0]) || {
      totalLeads: 0,
      wonLeads: 0,
      thisMonthLeads: 0,
      lastMonthLeads: 0
    };

    const totalLeads = summary.totalLeads || 0;
    const wonLeads = summary.wonLeads || 0;
    const thisMonthLeads = summary.thisMonthLeads || 0;
    const lastMonthLeads = summary.lastMonthLeads || 0;

    // Pre-populate breakdowns with 0 for all enum values to guarantee presence
    const statusBreakdown = {
      'New': 0,
      'Contacted': 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      'Won': 0,
      'Lost': 0
    };
    if (facet.statusBreakdown) {
      facet.statusBreakdown.forEach(item => {
        if (item._id && item._id in statusBreakdown) {
          statusBreakdown[item._id] = item.count;
        }
      });
    }

    const sourceBreakdown = {
      'Website': 0,
      'Referral': 0,
      'LinkedIn': 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      'Other': 0
    };
    if (facet.sourceBreakdown) {
      facet.sourceBreakdown.forEach(item => {
        if (item._id && item._id in sourceBreakdown) {
          sourceBreakdown[item._id] = item.count;
        }
      });
    }

    // (won / total) * 100, rounded to 1 decimal place. Prevent division-by-zero
    const conversionRate = totalLeads > 0 
      ? Math.round((wonLeads / totalLeads) * 100 * 10) / 10 
      : 0.0;

    // ((thisMonth - lastMonth) / lastMonth) * 100, rounded to 1 decimal place. Prevent division-by-zero
    const growthRate = lastMonthLeads > 0 
      ? Math.round((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100) * 10) / 10 
      : 0.0;

    const statsObject = {
      totalLeads,
      wonLeads,
      statusBreakdown,
      statusCounts: statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    };

    return successResponse(res, statsObject, 'Lead statistics retrieved successfully');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - getLeadStats Error]:', error);
    }
    next(error);
  }
};

/**
 * Aggregates leads created over the last 6 months, grouped by year and month.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends successResponse containing monthly stats array.
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - getMonthlyStats] User ID: ${req.user._id}`);
    }

    // Calculate boundary date for 6 months ago (including current month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1); // Set to 1st to prevent overflow issues
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Group leads by year and month using MongoDB aggregation with owner isolation
    const monthlyData = await Lead.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Won'] }, 1, 0]
            }
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Build the pre-populated 6-month sequence in Javascript to handle empty months
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1); // Crucial to prevent month overflow bugs
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      result.push({
        year,
        monthNum: d.getMonth() + 1, // 1-indexed
        month: `${monthsShort[d.getMonth()]} ${year}`,
        total: 0,
        won: 0,
        lost: 0
      });
    }

    // Merge database aggregation results with the generated 6-month array
    monthlyData.forEach(item => {
      const match = result.find(r => r.year === item._id.year && r.monthNum === item._id.month);
      if (match) {
        match.total = item.total;
        match.won = item.won;
        match.lost = item.lost;
      }
    });

    // Format output including conversionRate (won / total * 100, rounded to 1 decimal place)
    const formattedData = result.map(({ month, total, won, lost }) => {
      const conversionRate = total > 0 
        ? Math.round((won / total) * 100 * 10) / 10 
        : 0.0;
      return {
        month,
        total,
        won,
        lost,
        conversionRate
      };
    });

    return successResponse(res, formattedData, 'Monthly lead statistics retrieved successfully');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - getMonthlyStats Error]:', error);
    }
    next(error);
  }
};

/**
 * Quick search endpoint for autocomplete.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Sends successResponse with matching leads.
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Lead Controller - searchLeads] User ID: ${req.user._id} | Query: ${q}`);
    }

    const limitNum = parseInt(limit, 10) || 5;

    // Filter by owner isolation
    const filter = { owner: req.user._id };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    } else {
      // If query is empty, return empty array for autocomplete immediately
      return successResponse(res, [], 'Search query is empty');
    }

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search autocomplete results retrieved successfully');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Lead Controller - searchLeads Error]:', error);
    }
    next(error);
  }
};
