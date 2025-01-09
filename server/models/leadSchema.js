const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'interested', 'converted', 'closed'], 
    default: 'new' 
  },
  propertyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'property', // Referencing the Property model
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
