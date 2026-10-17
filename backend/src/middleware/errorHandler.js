import { ENV } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // If response has already started streaming, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);

  // Friendly messages for known Mongoose errors
  let message = err.message || 'An unexpected server error occurred.';
  if (err.name === 'CastError') {
    message = 'Resource not found with specified identifier.';
  } else if (err.code === 11000) {
    message = 'A record with that unique value already exists.';
  }

  // Safe logging: log error name and message only, never log request bodies containing passwords
  if (statusCode === 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err.message);
    if (!ENV.isProduction && err.stack) {
      console.error(err.stack);
    }
  }

  return res.status(statusCode).json({
    success: false,
    message: ENV.isProduction && statusCode === 500 ? 'Internal server error.' : message,
    ...(ENV.isProduction ? {} : { stack: err.stack }),
  });
}
