/**
 * Helper to send a consistent success response.
 * 
 * @param {object} res - Express response object.
 * @param {any} data - The payload to send back.
 * @param {string} message - User-friendly success message.
 * @param {number} [statusCode=200] - HTTP status code (defaults to 200).
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Helper to send a consistent error response.
 * 
 * @param {object} res - Express response object.
 * @param {string} message - Error description/message.
 * @param {number} [statusCode=500] - HTTP status code (defaults to 500).
 * @param {any} [errors=null] - Detailed error details (validation array, stack traces, etc.).
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Helper to send a consistent paginated response.
 * 
 * @param {object} res - Express response object.
 * @param {Array} data - Array of paginated data.
 * @param {number} total - Total count of records matching the query.
 * @param {number} page - Current page number.
 * @param {number} limit - Items per page.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const pages = Math.ceil(total / limit) || 1;
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  });
};
