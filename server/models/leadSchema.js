const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for anonymous leads
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    inquiryType: {
      type: String,
      enum: ['buy', 'rent', 'schedule_visit', 'other'], // Predefined inquiry types
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'converted', 'lost'],
      default: 'new',
    },
    source: {
      type: String,
      default: 'website', // Default source, e.g., website, ad campaign, referral
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Lead = mongoose.model('lead', leadSchema);

module.exports = Lead;
