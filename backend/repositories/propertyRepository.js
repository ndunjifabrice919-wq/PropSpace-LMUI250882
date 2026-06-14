const Property = require('../models/Property');

/**
 * Property Repository — handles all direct database interactions for Property documents.
 */

const findAll = (filter = {}) =>
  Property.find(filter)
    .populate('owner', 'username displayName avatar')
    .sort({ createdAt: -1 });

const findById = (id) =>
  Property.findById(id).populate('owner', 'username displayName avatar email phone');

const findByOwner = (ownerId) =>
  Property.find({ owner: ownerId }).sort({ createdAt: -1 });

const createProperty = (data) => {
  const property = new Property(data);
  return property.save();
};

const updateProperty = (id, data) =>
  Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteProperty = (id) => Property.findByIdAndDelete(id);

module.exports = {
  findAll,
  findById,
  findByOwner,
  createProperty,
  updateProperty,
  deleteProperty,
};
