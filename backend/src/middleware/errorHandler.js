import { ENV } from '../config/env.js';

/**
 * Centralized sanitized error handling middleware.
 * Prevents information disclosure:
 * - Never returns stack traces in production
 * - Does not expose MongoDB driver errors, JWT internals, or system paths
 * - Handles CORS rejections with proper 403 status
 * - Returns consistent, sanitized error responses
 */
export function errorHandler(err, req, res, next) {
  // If response has already started streaming, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle CORS rejection
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Origin not allowed by CORS policy.',
    });
  }

  // Determine status code
  let statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);

  // Friendly messages for known Mongoose errors
  let message = err.message || 'An unexpected server error occurred.';
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found with specified identifier.';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with that unique value already exists.';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired session token.';
  }

  // Safe server-side logging without logging passwords or secret tokens
  if (statusCode >= 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err.message);
    if (ENV.isDevelopment && err.stack) {
      console.error(err.stack);
    }
  }

  const isProd = ENV.isProduction || !ENV.isDevelopment;

  return res.status(statusCode).json({
    success: false,
    message: isProd && statusCode >= 500 ? 'Internal server error.' : message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}
