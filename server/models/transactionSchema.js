const mongoose = require("mongoose")
const Schema = mongoose.Schema


const transactionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    service_type: { 
      type: String, 
      enum: ["premium_listing", "subscription"], 
      required: true 
    },
    amount: { type: Number, required: true },
    payment_status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    payment_method: { type: String, enum: ["UPI", "card", "wallet"], required: true },
    transaction_date: { type: Date, default: Date.now },
    invoice_id: { type: String, unique: true, required: true }
  },{ timestamps: true });



  module.exports = mongoose.model("payment", transactionSchema);