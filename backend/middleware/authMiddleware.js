const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Validates the Bearer token from the Authorization header.
 * Attaches req.userId for use in controllers/repositories.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or has expired.' });
  }
};

module.exports = authenticate;
