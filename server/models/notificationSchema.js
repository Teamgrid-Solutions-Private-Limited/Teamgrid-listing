const mongoose = require("mongoose")
const Schema = mongoose.Schema


const notificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["inquiry", "payment", "property"], required: true },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
   created_at: { type: Date, default: Date.now }
  },{ timestamps: true });
  

module.exports = mongoose.model("notifications", notificationSchema);