# Virtual Deal Room

A real estate marketplace platform with integrated messaging, property listings, and document management capabilities.

## Table of Contents
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Key Features](#key-features)
- [Working Workflow](#working-workflow)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Current Development Status](#current-development-status)

## Folder Structure:

virtual-deal-room/
├── backend/                   # Server-side code
│   ├── config/                # Database configuration
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   │   └── fileUpload.js      # File upload middleware using Cloudinary
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   │   └── socket.js          # Socket.io configuration
│   ├── uploads/               # Temporary storage for file uploads
│   ├── .env                   # Server environment variables
│   ├── index.js               # Main server entry point
│   └── package.json           # Server dependencies
│
├── client/                    # Frontend code
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/            # Images and other static files
│   │   ├── components/        # React components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── chats/         # Chat-related components
│   │   │   ├── layout/        # Layout components
│   │   │   └── posts/         # Property listing components
│   │   ├── context/           # React context providers
│   │   │   ├── AppContext.jsx # Global state management
│   │   │   └── SocketContext.jsx # Socket.io context
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point for React
│   │   └── routes.jsx         # Application routes
│   ├── .env                   # Frontend environment variables
│   └── package.json           # Frontend dependencies
│
├── README.md                  # Project documentation
└── todo/                      # Development planning notes


## Environment Variables:

    backend/.env
        PORT=5000
        JWT_SECRET=your_jwt_secret
        MONGODB_URI=your_mongodb_uri
        FRONTEND_URL=http://localhost:5173

        # cloud config
        CLOUDINARY_CLOUD_NAME=youe_cloud_name
        CLOUDINARY_API_KEY=your_api_key
        CLOUDINARY_API_SECRET=your_api_secret


## Installation & Setup:
    Prerequisites-
        Node.js (v16.x or higher)
        MongoDB (local installation or MongoDB Atlas)
        Cloudinary account for file storage

    backend setup:
        1. Navigate to the backend directory: cd backend
        2. Install dependencies: npm install
        3. Create .env file based on the environment variables above cp .env.example .env  # Then edit the .env file with your values
        4. Start the server: npm start
        5. The server will run on http://localhost:5000 by default.

    frontend setup:
        1. Navigate to the client directory: cd client
        2. Install dependencies: npm install
        3. Create .env file based on the environment variables above cp .env.example .env  # Then edit the .env file with your values
        4. Start the frontend: npm run dev
        5. The frontend will run on http://localhost:5173 by default.



## API Documentation:

    - Authentication:
        - POST /api/auth/register: Register a new user
        - POST /api/auth/login: Login an existing user
        - GET /api/auth/logout: Logout the current user

    - Chat Endpoints:
        - GET /api/chat - Get all user's chats
        - POST /api/chat - Create a new chat
        - GET /api/chat/:chatId - Get a specific chat
        - GET /api/chat/messages/:chatId - Get all messages for a chat
        - POST /api/chat/message/send - Send a new message
        - PUT /api/chat/message/read/:messageId - Mark message as read
        - POST /api/chat/upload - Upload file attachment for chat - to be completed


## Technologies Used: 

    Backend:
        Node.js & Express.js
        MongoDB & Mongoose
        Socket.IO for real-time communication
        JWT for authentication
        Multer & Cloudinary for file uploads

    Frontend:
        React (with Vite build tool)
        React Context API for state management
        Socket.IO client for real-time features
        React Router for navigation
        Chakra UI / Tailwind CSS for styling


Current Development Status:
    The following features are currently under development:

        ⏳ File upload in conversations (in progress)
        🔄 Edit post functionality
        🔄 Edit, delete, and update chat functionality
        🔄 "Show my deals" feature
        🔄 Bidding system implementation
        🔄 User profile page
        🔄 Context API issues (needs fixing)
        🔄 Contact owner button functionality (needs fixing)