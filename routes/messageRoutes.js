const express = require('express');

const messageController = require('../controllers/messageController.js');
const isAuth = require("../middlewares/authMiddleware.js"); // Assuming this is your auth middleware


const router = express.Router();

// Route to send a message
router.post('/messages', messageController.createMessage);

// Route to get conversation messages
router.get('/messages/conversation/:conversationId',  messageController.getMessages);


router.get('/messages/:userId',  messageController.getMessagesByUserId);

router.delete('/messages/:conversationId',  messageController.deleteMessages);


module.exports = router;

