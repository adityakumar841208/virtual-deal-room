const express = require('express');
const router = express.Router();

const { 
  sendMessage, 
  getAllMessages, 
  getChatsByUser, 
  createChat,
  getChat,
  deleteMessage,
  markAsRead
} = require('../controllers/chatController');

// chat management
router.post('/create', createChat);                  // Create a new chat/conversation
router.get('/user/:userId', getChatsByUser);        // Get all chats for a specific user

// individual chat functionality
router.get('/:chatId', getChat);                     // Get details of a specific chat
router.get('/messages/:chatId', getAllMessages);     // Get all messages in a specific chat

// message operation
router.post('/message/send', sendMessage);           // Send a message in a chat
router.delete('/message/:messageId', deleteMessage); // Delete a message
router.put('/message/read/:messageId', markAsRead);  // Mark a message as read

module.exports = router;

