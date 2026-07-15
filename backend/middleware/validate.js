import { validationResult } from 'express-validator';

/**
 * Custom validation runner middleware.
 * Sequentially executes validation checks and intercepts any validation errors,
 * responding with a structured 400 response format.
 * 
 * @param {Array} validations - Array of express-validator validation chains to execute.
 * @returns {Function} Express middleware.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Run all incoming validation checks asynchronously
      await Promise.all(validations.map((validation) => validation.run(req)));

      // Collect validation results
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Format errors into standard structure: { field: string, message: string }[]
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }));

      // Return structured validation error response
      return res.status(400).json({
        success: false,
        errors: formattedErrors
      });
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
