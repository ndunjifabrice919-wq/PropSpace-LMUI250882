const bcrypt = require('bcrypt');
const userRepo = require('../repositories/userRepository');

const SALT_ROUNDS = 12;

/**
 * GET /api/users/profile
 * Protected — returns the authenticated user's profile (no password).
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/profile
 * Protected — updates profile fields: displayName, phone, avatar, bio.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { displayName, phone, avatar, bio } = req.body;

    const allowedUpdates = {};
    if (displayName !== undefined) allowedUpdates.displayName = displayName;
    if (phone !== undefined) allowedUpdates.phone = phone;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;
    if (bio !== undefined) allowedUpdates.bio = bio;

    const updated = await userRepo.updateProfile(req.userId, allowedUpdates);
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/security
 * Protected — changes the user's password after verifying the old one.
 */
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both currentPassword and newPassword are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await userRepo.findByIdWithPassword(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, updatePassword };
