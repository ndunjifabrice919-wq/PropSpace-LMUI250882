/**
 * Global Error Handler Middleware
 * Catches any unhandled errors passed via next(err) and returns a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} —`, err.message);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key error (e.g. unique email/username)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} is already in use.` });
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token has expired. Please log in again.' });
  }

  // Generic fallback
  return res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred.',
  });
};

module.exports = errorHandler;
