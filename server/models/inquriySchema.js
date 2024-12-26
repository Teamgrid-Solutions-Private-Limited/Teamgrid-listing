const mongoose = require("mongoose");
const { Schema } = mongoose;

const InquirySchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    buyer_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "responded", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("inquirys", InquirySchema);
