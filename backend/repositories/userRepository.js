const User = require('../models/User');

/**
 * User Repository — handles all direct database interactions for User documents.
 */

const findByEmail = (email) => User.findOne({ email });

const findByUsername = (username) => User.findOne({ username });

const findByEmailOrUsername = (email, username) =>
  User.findOne({ $or: [{ email }, { username }] });

const findById = (id) => User.findById(id).select('-password');

const findByIdWithPassword = (id) => User.findById(id);

const createUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

const updateProfile = (id, updates) =>
  User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');

module.exports = {
  findByEmail,
  findByUsername,
  findByEmailOrUsername,
  findById,
  findByIdWithPassword,
  createUser,
  updateProfile,
};
