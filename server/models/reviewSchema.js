const mongoose = require("mongoose");
const { Schema } = mongoose;


// Review Schema
const reviewSchema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },{timestamps:true});
  
 module.exports = mongoose.model('Review', reviewSchema);