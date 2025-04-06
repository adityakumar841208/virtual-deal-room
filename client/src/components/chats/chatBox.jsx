import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import { BiSend, BiPaperclip, BiSmile, BiDotsVerticalRounded, BiCheck, BiCheckDouble } from 'react-icons/bi';
import { format } from 'date-fns';

const ChatBox = ({ chatId }) => {
  const { state } = useAppContext();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch chat info and messages when chat ID changes
  useEffect(() => {
    if (chatId) {
      fetchChatInfo();
      fetchMessages();

      // Join the chat room
      if (socket) {
        socket.emit('join chat', chatId);
      }
    }

    return () => {
      if (socket && chatId) {
        socket.emit('leave chat', chatId);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, socket]);

  // Socket listeners for messages and typing
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMessageReceived) => {
      const userID = state.user?._id || JSON.parse(localStorage.getItem('user'))?.id;

      // Only add the message if it's for this chat AND not from the current user
      if (newMessageReceived.chat === chatId && newMessageReceived.sender._id !== userID) {
        setMessages(prev => [...prev, newMessageReceived]);
        markMessageAsRead(newMessageReceived._id);
      }
    };

    const typingHandler = (typingChatId) => {
      if (typingChatId === chatId) setTyping(true);
    };

    const stopTypingHandler = (typingChatId) => {
      if (typingChatId === chatId) setTyping(false);
    };

    socket.on('message received', messageHandler);
    socket.on('typing', typingHandler);
    socket.on('stop typing', stopTypingHandler);

    return () => {
      socket.off('message received', messageHandler);
      socket.off('typing', typingHandler);
      socket.off('stop typing', stopTypingHandler);
    };
  }, [socket, chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatInfo = async () => {
    console.log('Fetching chat info for chatId:', chatId);
    try {
      const response = await fetch(`http://localhost:3000/api/chat/${chatId}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setChatInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };

  const fetchMessages = async () => {
    if (!chatId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/chat/messages/${chatId}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.data);

        // Mark unread messages as read
        data.data.forEach(msg => {
          if (!msg.isRead && msg.sender._id !== state.user?._id) {
            markMessageAsRead(msg._id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await fetch(`http://localhost:3000/api/chat/message/read/${messageId}`, {
        method: 'PUT',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing', chatId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', chatId);
    }, 3000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      if (socket) {
        socket.emit('stop typing', chatId);
      }

      const userID = state.user?._id || JSON.parse(localStorage.getItem('user'))?.id;
      if (!userID) {
        console.error("No user ID available to send message");
        return;
      }

      const messageData = {
        chatId: chatId,
        senderId: userID,
        content: newMessage,
      };
      console.log('Sending message:', messageData);

      const response = await fetch('http://localhost:3000/api/chat/message/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (data.success) {
        setNewMessage('');
        setMessages(prev => [...prev, data.data]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChatName = () => {
    if (!chatInfo) return 'Loading...';

    if (chatInfo.title && chatInfo.title !== 'New Conversation') {
      return chatInfo.title;
    }

    const userID = state.user?._id || JSON.parse(localStorage.getItem('user'))?._id;
    const otherParticipant = chatInfo.participants?.find(p => p._id !== userID);
    return otherParticipant ? otherParticipant.name : 'Chat';
  };

  const getParticipantsText = () => {
    if (!chatInfo?.participants) return '';

    const userID = state.user?._id || JSON.parse(localStorage.getItem('user'))?._id;
    const otherParticipants = chatInfo.participants.filter(p => p._id !== userID);

    if (otherParticipants.length === 0) return '';
    if (otherParticipants.length === 1) return otherParticipants[0].email || '';

    return `${otherParticipants.length} participants`;
  };

  const formatMessageTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const userID = state.user?._id || JSON.parse(localStorage.getItem('user'))?.id;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-white">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {getChatName().charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-gray-800">{getChatName()}</h2>
            <p className="text-xs text-gray-500">{getParticipantsText()}</p>
          </div>
        </div>
        <div>
          <button className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100">
            <BiDotsVerticalRounded size={20} />
          </button>
        </div>
      </div>

      {/* Messages area - use flex-1 to take available space */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* Message content remains the same */}
        {messages.map((message, index) => {
          const isOwnMessage = message.sender._id === userID;
          const showSender = index === 0 || messages[index - 1].sender._id !== message.sender._id;

          return (
            <div key={message._id} className={`mb-4 ${isOwnMessage ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
              {!isOwnMessage && showSender && (
                <span className="text-xs text-gray-500 ml-12 mb-1">{message.sender.name}</span>
              )}

              <div className={`flex items-end ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                {!isOwnMessage && showSender && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 mr-2 flex items-center justify-center text-gray-600 text-sm">
                    {message.sender.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md ${isOwnMessage
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}>
                  <p>{message.content}</p>
                </div>

                {isOwnMessage && (
                  <div className="text-xs text-gray-500 mr-2 flex items-center">
                    {message.isRead ? (
                      <BiCheckDouble size={16} className="text-blue-500 ml-1" />
                    ) : (
                      <BiCheck size={16} className="ml-1" />
                    )}
                  </div>
                )}
              </div>

              <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'mr-12' : 'ml-12'}`}>
                {formatMessageTime(message.createdAt)}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex items-center space-x-2 text-gray-500 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">Typing...</span>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Message input - sticky at bottom */}
      <div className="sticky bottom-0 border-t border-gray-200 p-3 bg-gray-100 z-10">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
          >
            <BiPaperclip size={20} />
          </button>

          <div className="flex-grow relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder="Type a message..."
              className="w-full py-2 px-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${newMessage.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <BiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;