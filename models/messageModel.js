const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;
