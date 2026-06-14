const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  propertyType: { type: String, enum: ['Apartment', 'House', 'Studio'], required: true },
  imageUrls: [{ type: String }],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
