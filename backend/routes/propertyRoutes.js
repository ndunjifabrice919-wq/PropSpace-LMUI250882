const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/authMiddleware');

// Get all properties (public feed)
router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const properties = await Property.find(filter).populate('authorId', 'username name avatar');
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get author listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const properties = await Property.find({ authorId: req.userId });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('authorId', 'username name avatar email phone');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create property
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, city, country, propertyType, imageUrls } = req.body;
    if (!title || !description || !price || !city || !country || !propertyType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const property = new Property({
      title, description, price, city, country, propertyType, imageUrls, authorId: req.userId
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update property
router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
