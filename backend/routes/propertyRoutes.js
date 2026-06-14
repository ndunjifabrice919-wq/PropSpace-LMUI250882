const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getAllProperties,
  getMyListings,
  getPropertyById,
  createProperty,
  updateProperty,
  removeProperty,
} = require('../controllers/propertyController');

// GET /api/properties — public feed with optional filters
router.get('/', getAllProperties);

// GET /api/properties/my-listings — authenticated user's own listings
router.get('/my-listings', auth, getMyListings);

// GET /api/properties/:id — single property detail (public)
router.get('/:id', getPropertyById);

// POST /api/properties — create a new listing (auth required)
router.post('/', auth, createProperty);

// PUT /api/properties/:id — update an existing listing (auth + ownership required)
router.put('/:id', auth, updateProperty);

// DELETE /api/properties/:id — permanently remove a listing (auth + ownership required)
router.delete('/:id', auth, removeProperty);

module.exports = router;
