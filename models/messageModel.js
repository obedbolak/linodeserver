const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  productId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Optional
  productName: { type: String, required: false }, // Optional
  timestamp: { type: Date, default: Date.now },
});

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;
