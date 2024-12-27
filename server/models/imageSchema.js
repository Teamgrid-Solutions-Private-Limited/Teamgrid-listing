const mongoose = require('mongoose');

 
const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,   
    required: true,
    ref: 'users',   
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,   
    required: true,
    ref: 'property',  
  },
  photo: {
    type: String,  // Now storing only the filename as a string
    
  },
  status: {
    type: String,
    enum: ['verified', 'pending', 'rejected'],  // Status can be verified, pending, or rejected
    default: 'pending',
  },
});

 
const Image = mongoose.model('image', imageSchema);

module.exports = Image;
