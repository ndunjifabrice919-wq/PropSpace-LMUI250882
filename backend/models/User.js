const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  displayName: { type: String, trim: true },
  phone: { type: String },
  avatar: { type: String },
  bio: { type: String, maxlength: 300 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

