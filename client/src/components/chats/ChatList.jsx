import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';

const ChatList = ({ onSelectChat, selectedChatId, searchQuery = '' }) => {
  const { state } = useAppContext();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('user') || state.id;
    const parsedUser = JSON.parse(userId);

    if (parsedUser.id) {
      fetchChats();
    };

  }, [state.id]);

  const fetchChats = async () => {
    const userId = localStorage.getItem('user') || state.id;
    const parsedUser = JSON.parse(userId);

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/user/${parsedUser.id}`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChatName = (chat) => {
    // for group chats, use the title
    if (chat.title && chat.title !== 'New Conversation') {
      return chat.title;
    }

    // For 1:1 chats, use the other person's name
    const otherParticipants = chat.participants.filter(p => p._id !== state.id);
    if (otherParticipants.length > 0) {
      return otherParticipants[0].name;
    }

    return 'Unknown Chat';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage || !chat.lastMessage.content) return 'No messages yet';
    return chat.lastMessage.content.length > 30
      ? chat.lastMessage.content.substring(0, 30) + '...'
      : chat.lastMessage.content;
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // filter chats based on search query
  const filteredChats = searchQuery
    ? chats.filter(chat => {
      const chatName = getChatName(chat);
      return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    })
    : chats;

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading conversations...
      </div>
    );
  }

  if (filteredChats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {searchQuery ? 'No matching conversations' : 'No conversations yet'}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {filteredChats.map((chat) => {
        const chatName = getChatName(chat);
        const isSelected = selectedChatId === chat._id;
        const hasUnread = chat.lastMessage && !chat.lastMessage.isRead && chat.lastMessage.sender !== state.id;

        return (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className={`p-4 cursor-pointer transition-colors ${isSelected
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : hasUnread
                ? 'bg-gray-50 hover:bg-gray-100'
                : 'hover:bg-gray-50'
              }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-medium ${isSelected ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                  {getInitials(chatName)}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex justify-between">
                  <h3 className={`font-medium truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {chatName}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {chat.lastMessage && getTimeAgo(chat.lastMessage.createdAt)}
                  </span>
                </div>

                <div className="flex items-center mt-1">
                  {chat.lastMessage && chat.lastMessage.sender === state.id && (
                    <span className="mr-1 text-gray-400">
                      {chat.lastMessage.isRead ? (
                        <BiCheckDouble size={16} className="text-blue-500" />
                      ) : (
                        <BiCheck size={16} />
                      )}
                    </span>
                  )}

                  <p className={`text-sm truncate ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                    {getLastMessagePreview(chat)}
                  </p>

                  {hasUnread && (
                    <span className="ml-auto bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;