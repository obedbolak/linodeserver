const mongoose = require("mongoose");

// Lost Item Schema
const lostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  status: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  isApproved: {
      type: Boolean,
      default: false,  // default to false if not explicitly set
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LostItem = mongoose.model("LostItem", lostItemSchema);
module.exports = LostItem;
