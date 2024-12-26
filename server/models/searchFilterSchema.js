const mongoose = require("mongoose");
const { Schema } = mongoose;

const searchFilterSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    radius: { type: Number, default: 5 }, // Radius in km for geospatial queries
    propertyType: {
        type: String,
        enum: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'],
    },
    budget: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000000 },
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    sortBy: {
        type: String,
        enum: ['Relevance', 'PriceLowToHigh', 'PriceHighToLow', 'NewestFirst'],
        default: 'Relevance',
    },
}, { timestamps: true });

searchFilterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("SearchFilter", searchFilterSchema);
