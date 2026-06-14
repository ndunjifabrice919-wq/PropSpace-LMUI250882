const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

const SALT_ROUNDS = 12;

/**
 * POST /api/auth/register
 * Creates a new user account with hashed password and returns a signed JWT.
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required: username, email, password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await userRepo.findByEmailOrUsername(email, username);
    if (existing) {
      const conflict = existing.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${conflict} is already taken.` });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await userRepo.createUser({ username, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Validates credentials and returns a signed JWT on success.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
