const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const userRoute = require('./routes/userRoute');
const cors = require('cors')
const dbConnect = require('./config/connection')
const cookieParser = require('cookie-parser')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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


//for login, register, getdetails, logout
app.use('/api', userRoute)

// for testing
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Socket.io setup
io.on('connection', (socket) => {
  // console.log('A user connected');

  // socket.on('message', (msg) => {
  //   console.log('Received:', msg);
  //   io.emit('message', msg); // Broadcast to all clients
  // });

  // socket.on('disconnect', () => {
  //   console.log('A user disconnected');
  // });
})

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
