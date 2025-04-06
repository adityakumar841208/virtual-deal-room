Here’s a cleaned-up and properly formatted version of your documentation for **Virtual Deal Room**:

---

# **Virtual Deal Room**

A real estate marketplace platform with integrated messaging, property listings, and document management capabilities.

---

## **Table of Contents**

- [Folder Structure](#folder-structure)  
- [Environment Variables](#environment-variables)  
- [Installation & Setup](#installation--setup)  
- [Running the Application](#running-the-application)  
- [Key Features](#key-features)  
- [Working Workflow](#working-workflow)  
- [API Documentation](#api-documentation)  
- [Technologies Used](#technologies-used)  
- [Current Development Status](#current-development-status)  

---

## **Folder Structure**

```
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
│   ├── uploads/               # Temporary file storage
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
```

---

## **Environment Variables**

### `backend/.env`
```
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:5173

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `frontend/.env`
```
VITE_BACKEND_URL=http://localhost:3000
```

---

## **Installation & Setup**

### **Prerequisites**
- Node.js (v16.x or higher)  
- MongoDB (local or MongoDB Atlas)  
- Cloudinary account (for file uploads)  

---

### **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env  # Then configure the .env file
npm start
```
> The server will run at `http://localhost:3000`

---

### **Frontend Setup**
```bash
cd client
npm install
cp .env.example .env  # Then configure the .env file
npm run dev
```
> The frontend will run at `http://localhost:5173`

---

## **API Documentation**

### **Authentication**
- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/login` – Login an existing user  
- `GET /api/auth/logout` – Logout the current user  

### **Chat Endpoints**
- `GET /api/chat` – Get all user's chats  
- `POST /api/chat` – Create a new chat  
- `GET /api/chat/:chatId` – Get a specific chat  
- `GET /api/chat/messages/:chatId` – Get messages of a chat  
- `POST /api/chat/message/send` – Send a message  
- `PUT /api/chat/message/read/:messageId` – Mark message as read  
- `POST /api/chat/upload` – Upload a file (in-progress)  

---

## **Technologies Used**

### **Backend**
- Node.js & Express.js  
- MongoDB & Mongoose  
- Socket.IO for real-time communication  
- JWT for authentication  
- Multer + Cloudinary for file handling  

### **Frontend**
- React (with Vite)  
- React Context API  
- Socket.IO client  
- React Router  
- Tailwind CSS  

---

## **Current Development Status**

The following features are **in progress**:

- ⏳ File upload in conversations  
- 🔄 Edit post functionality  
- 🔄 Edit, delete & update chat functionality  
- 🔄 "Show My Deals" feature  
- 🔄 Bidding system implementation  
- 🔄 User profile page  
- 🛠 Context API issue (bug fix required)  
- 🛠 "Contact Owner" button functionality  

---
