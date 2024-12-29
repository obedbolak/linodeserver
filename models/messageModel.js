// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    
    type: String,

    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  senderType: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
conversationId:{
 type: String,
    required: true
}
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
