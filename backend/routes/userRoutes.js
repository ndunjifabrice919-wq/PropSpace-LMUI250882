const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile, updatePassword } = require('../controllers/userController');

// GET /api/users/profile — fetch authenticated user's profile
router.get('/profile', auth, getProfile);

// PUT /api/users/profile — update profile fields
router.put('/profile', auth, updateProfile);

// PUT /api/users/security — update password (requires current password verification)
router.put('/security', auth, updatePassword);

module.exports = router;
