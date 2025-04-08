let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
      },
      allowEIO3: true
    });
    
    io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);
      
      // join a chat room
      socket.on('join chat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);
      });
      
      // leave a chat room
      socket.on('leave chat', (chatId) => {
        socket.leave(chatId);
        console.log(`User left chat room: ${chatId}`);
      });
      
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
    
    return io;
  },
  
  getIO: () => {
    if (!io) {
      console.warn('Socket.io not initialized yet');
      return null;
    }
    return io;
  }
};