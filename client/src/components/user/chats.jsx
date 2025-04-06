import React, { useState, useEffect } from 'react';
import ChatList from '../chats/ChatList';
import ChatBox from '../chats/chatBox';
import { useAppContext } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import { BiMessageDetail, BiSearch, BiPlus, BiFilter } from 'react-icons/bi';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);                                                                                                                                                       
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useAppContext();
  const { socket } = useSocket();
  
  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
  };
  
  // listen for new messages in any chat
  useEffect(() => {
    if (!socket) return;
    
    socket.on('message received', (newMessage) => {
      // notification logic here
      console.log('New message received:', newMessage);
    });
    
    return () => {
      socket.off('message received');
    };
  }, [socket]);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-x overflow-hidden">
      {/* sidebar with chat list */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* header with search and new chat button */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <BiMessageDetail className="mr-2 text-blue-600" />
            Messages
          </h1>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="New conversation"
            >
              <BiPlus size={20} />
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">All</button>
              <button className="px-3 py-1 hover:bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Unread</button>
              <button className="px-3 py-1 hover:bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Archived</button>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <BiFilter size={20} />
            </button>
          </div>
        </div>
        
        {/* chat list */}
        <div className="overflow-y-auto flex-grow">
          <ChatList 
            onSelectChat={handleSelectChat} 
            selectedChatId={selectedChat} 
            searchQuery={searchQuery}
          />
        </div>
      </div>
      
      {/* main chat area */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <ChatBox chatId={selectedChat} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 p-4">
            <div className="max-w-sm text-center">
              <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
                <BiMessageDetail className="text-blue-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500 mb-6">Choose an existing conversation or start a new one to begin messaging</p>
              <button 
                onClick={() => setShowNewChatModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center mx-auto"
              >
                <BiPlus className="mr-2" />
                New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* new chat modal */}
      {showNewChatModal && (
        <NewChatModal onClose={() => setShowNewChatModal(false)} onChatCreated={handleSelectChat} />
      )}
    </div>
  );
};

// new Chat Modal Component
const NewChatModal = ({ onClose, onChatCreated }) => {
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatTitle, setChatTitle] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useAppContext();

  // ftetch users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          // filter out current user
          const filteredUsers = data.users.filter(user => user._id !== state.id);
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [state.id]);
  
  const handleUserSelect = (user) => {
    if (selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;
    
    setLoading(true);
    try {
      const title = chatTitle.trim() || (selectedUsers.length === 1 
        ? `Chat with ${selectedUsers[0].name}` 
        : `Group Chat (${selectedUsers.length + 1})`);
      
      const participantIds = [state.id, ...selectedUsers.map(u => u._id)];
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          participants: participantIds
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onChatCreated(data.data._id);
        onClose();
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">
            {step === 1 ? 'New Conversation' : 'Set Chat Details'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 ? (
            <>
              {/* search input */}
              <div className="mb-4 relative">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* selected users */}
              {selectedUsers.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div 
                      key={user._id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      {user.name}
                      <button 
                        onClick={() => handleUserSelect(user)}
                        className="ml-2 text-blue-800 hover:text-blue-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* user list */}
              <div className="overflow-y-auto max-h-60 border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading users...</div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div 
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                      className={`p-3 border-b last:border-b-0 flex items-center cursor-pointer ${
                        selectedUsers.some(u => u._id === user._id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {selectedUsers.some(u => u._id === user._id) && (
                        <div className="ml-auto">
                          <div className="bg-blue-500 rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No users found</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Chat Title (optional)
                </label>
                <input
                  type="text"
                  value={chatTitle}
                  onChange={e => setChatTitle(e.target.value)}
                  placeholder={selectedUsers.length === 1 
                    ? `Chat with ${selectedUsers[0].name}` 
                    : `Group Chat (${selectedUsers.length + 1})`
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Participants ({selectedUsers.length + 1})
                </label>
                <div className="p-3 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {state.name ? state.name.charAt(0).toUpperCase() : 'Y'}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{state.name || 'You'} (You)</p>
                    </div>
                  </div>
                  
                  {selectedUsers.map(user => (
                    <div key={user._id} className="flex items-center mt-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{user.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* tooter */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
          {step === 1 ? (
            <>
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedUsers.length > 0 && setStep(2)}
                disabled={selectedUsers.length === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedUsers.length > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Back
              </button>
              <button
                onClick={handleCreateChat}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-75"
              >
                {loading ? 'Creating...' : 'Create Chat'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;