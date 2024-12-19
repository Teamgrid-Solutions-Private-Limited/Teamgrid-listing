const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password_hash: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["normal_users","admin"], required: true },
    profile_picture: { type: String }, // Optional
    
  },{ timestamps: true });

  module.exports =mongoose.model("users",UserSchema);