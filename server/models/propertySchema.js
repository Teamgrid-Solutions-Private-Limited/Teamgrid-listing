const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PropertySchema = new Schema({
    
    title: { type: String, required: true },  
    description: { type: String }, 
    price: { type: Number, required: true }, 
      location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  },
    property_type: { 
      type: String, 
      enum: ["apartment", "house", "plot", "commercial"], 
      required: true 
    },  
    area: { type: Number, required: true },  
     
    status: { 
      type: String, 
      enum: ["available", "sold", "rented"], 
      default: "available" 
    }, // Property status
    address: { type: String, required: true },  
    city: { type: String, required: true }, 
    state: { type: String, required: true },  
    zipCode: { type: String, required: true },  
    listedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }, // User ID who listed the property
   
  },{ timestamps: true });
   
  // Create 2D Sphere Index for Geospatial Queries (for map-based search)
  PropertySchema.index({ location: "2dsphere" });
   
  module.exports = mongoose.model("property", PropertySchema);