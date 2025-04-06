const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const socketIO = require('../utils/socket');

// Create a new chat/conversation
exports.createChat = async (req, res) => {

  try {
    const { title, participants } = req.body;
    console.log(req.body)
    if (!participants || participants.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least two participants are required'
      });
    }

    // Create the new chat
    const newChat = await Chat.create({
      title: title || 'New Conversation',
      participants,
      createdAt: new Date()
    });

    // Add the chat ID to each participant's chatIds array
    // await User.updateMany(
    //   { _id: { $in: participants } },
    //   { $push: { chatIds: newChat._id } }
    // );

    res.status(201).json({
      success: true,
      data: newChat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not create chat',
      error: error.message
    });
  }
};

// Get a specific chat by ID
exports.getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email');
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not retrieve chat',
      error: error.message
    });
  }
};

// Get all chats for a specific user
exports.getChatsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not retrieve chats',
      error: error.message
    });
  }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    
    // Validate required fields
    if (!chatId || !senderId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID, sender ID and content are required'
      });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify sender is a participant in the chat
    if (!chat.participants.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: 'User is not a participant in this chat'
      });
    }

    // Create and save the message
    const newMessage = await Message.create({
      chat: chatId,
      sender: senderId,
      content: content.trim(), // Basic sanitization
      isRead: false
      // Let MongoDB handle the createdAt timestamp automatically
    });

    // Update the chat's lastMessage and updatedAt
    chat.lastMessage = newMessage._id;
    chat.updatedAt = new Date();
    await chat.save();

    // Populate sender info for the response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email');

    // Emit the message to the chat room
    const io = socketIO.getIO();
    if (io) {
      io.to(chatId).emit('message received', populatedMessage);
    } else {
      console.warn('Socket.io not available for real-time message delivery');
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not send message',
      error: error.message
    });
  }
};

// Get all messages in a specific chat
exports.getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not retrieve messages',
      error: error.message
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findByIdAndDelete(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not delete message',
      error: error.message
    });
  }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not update message',
      error: error.message
    });
  }
};