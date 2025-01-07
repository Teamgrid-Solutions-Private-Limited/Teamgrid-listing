const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    WhomId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'property', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
  }
);

const Testimonial = mongoose.model('testimonial', testimonialSchema);

module.exports = Testimonial;
