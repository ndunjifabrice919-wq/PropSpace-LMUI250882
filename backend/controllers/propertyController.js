const propertyRepo = require('../repositories/propertyRepository');

/**
 * GET /api/properties
 * Public — returns all listings, supports filtering by city, price range, type, and status.
 */
const getAllProperties = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, propertyType, listingStatus } = req.query;
    const filter = {};

    if (city) filter.city = new RegExp(city.trim(), 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (listingStatus) filter.listingStatus = listingStatus;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await propertyRepo.findAll(filter);
    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/properties/my-listings
 * Protected — returns only listings belonging to the authenticated user.
 */
const getMyListings = async (req, res, next) => {
  try {
    const listings = await propertyRepo.findByOwner(req.userId);
    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/properties/:id
 * Public — returns a single property by ID.
 */
const getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyRepo.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property listing not found.' });
    }
    return res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/properties
 * Protected — creates a new property listing for the authenticated user.
 */
const createProperty = async (req, res, next) => {
  try {
    const { title, description, price, city, country, propertyType, listingStatus, bedrooms, imageUrls } = req.body;

    if (!title || !description || !price || !city || !country || !propertyType || !listingStatus) {
      return res.status(400).json({ message: 'Missing required fields: title, description, price, city, country, propertyType, listingStatus.' });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    const newListing = await propertyRepo.createProperty({
      title,
      description,
      price: Number(price),
      city,
      country,
      propertyType,
      listingStatus,
      bedrooms: bedrooms ? Number(bedrooms) : 1,
      imageUrls: imageUrls || [],
      owner: req.userId,
    });

    return res.status(201).json(newListing);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/properties/:id
 * Protected — updates a listing; only the owner may do this.
 */
const updateProperty = async (req, res, next) => {
  try {
    const property = await propertyRepo.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property listing not found.' });
    }

    if (property.owner._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied. You are not the owner of this listing.' });
    }

    const updated = await propertyRepo.updateProperty(req.params.id, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/properties/:id
 * Protected — deletes a listing; only the owner may do this.
 */
const removeProperty = async (req, res, next) => {
  try {
    const property = await propertyRepo.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property listing not found.' });
    }

    if (property.owner._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied. You are not the owner of this listing.' });
    }

    await propertyRepo.deleteProperty(req.params.id);
    return res.status(200).json({ message: 'Listing removed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProperties,
  getMyListings,
  getPropertyById,
  createProperty,
  updateProperty,
  removeProperty,
};
