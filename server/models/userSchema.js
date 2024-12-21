const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    profile_picture: { type: String }, // Optional
    
  },{ timestamps: true });

  module.exports =mongoose.model("users",UserSchema);