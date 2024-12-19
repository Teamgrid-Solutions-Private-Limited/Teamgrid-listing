const mongoose = require('mongoose');
const { Schema } = mongoose;


const favoriteSchema = new Schema({
    buyer_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    property_id: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    
  },{ timestamps: true });
  
module.exports =mongoose.model("favourite",favoriteSchema)