const express = require('express');
const http = require('http');
const socketIO = require('./utils/socket');
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const dbConnect = require('./config/connection');
const cookieParser = require('cookie-parser');
const chatRoute = require('./routes/chatRoute');
const postRoute = require('./routes/postRoute')

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIO.init(server);

//database connection
dbConnect()
console.log(process.env.FRONTEND_URL)

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(cookieParser())

// Socket.io setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join a specific chat room
  socket.on('join chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Handle new messages
  socket.on('new message', (newMessage) => {
    const chat = newMessage.chat;
    
    // Don't send back to sender
    socket.to(chat).emit('message received', newMessage);
  });

  // Typing indicator
  socket.on('typing', (chatId) => {
    socket.to(chatId).emit('typing', chatId);
  });

  socket.on('stop typing', (chatId) => {
    socket.to(chatId).emit('stop typing', chatId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
})

//for login, register, getdetails, logout
app.use('/api', userRoute)

//for chat
app.use('/api/chat', chatRoute);

//for uploading and reacting post
app.use('/api/post',postRoute)

// for testing
app.get('/', (req, res) => {
  res.send('Hello World');
});



module.exports = { app, server }; // No need to export io here

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
