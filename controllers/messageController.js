// controllers/messageController.js
const Message = require('../models/messageModel.js');

const messageController = {
  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { senderId, receiverId, productId, content, senderType, conversationId } = req.body;
      
      const newMessage = new Message({
        senderId,
        receiverId,
        productId,
        content,
        senderType,
conversationId
      });

      const savedMessage = await newMessage.save();
      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(500).json({ error: 'Error creating message: ' + error.message });
    }
  },

  
getMessagesByUserId: async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you'll pass the userId as a URL parameter
    
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this user' });
    }
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages: ' + error.message });
  }
},




// Get messages for a specific conversation
  getMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .populate('senderId', 'name profileImage')
        .populate('receiverId', 'name profileImage')
        .populate('productId', 'name images price');

      res.status(200).json({
        success: true,
        messages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching conversation messages',
        error: error.message
      });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { messageIds } = req.body;
      
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { isRead: true } }
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error marking messages as read: ' + error.message });
    }
  },









  // Get unread message count
  getUnreadCount: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const count = await Message.countDocuments({
        receiverId: userId,
        isRead: false
      });

      res.json({ unreadCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Error getting unread count: ' + error.message });
    }
  }
};

module.exports = messageController;
