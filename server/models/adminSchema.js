const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminActivitySchema = new Schema({
  admin_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  action: { type: String, required: true },
  target_id: { type: Schema.Types.ObjectId }, // Could be a Property or User ID
  
},{ timestamps: true });

module.exports = mongoose.model("adminactivity", adminActivitySchema);
