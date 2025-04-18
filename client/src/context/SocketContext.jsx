import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // initialize socket connection
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
    setSocket(newSocket);

    console.log('Socket connected');

    // disconnect socket when component unmounts
    return () => {
      if (newSocket) {
        console.log('Socket disconnected');
        newSocket.disconnect();
      }
    };
  }, []);

  const joinChatRoom = (chatId) => {
    if (socket && chatId) {
      socket.emit('join chat', chatId);
      console.log(`Joined chat room: ${chatId}`);
    }
  };

  const leaveChatRoom = (chatId) => {
    if (socket && chatId) {
      socket.emit('leave chat', chatId);
      console.log(`Left chat room: ${chatId}`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinChatRoom, leaveChatRoom }}>
      {children}
    </SocketContext.Provider>
  );
};