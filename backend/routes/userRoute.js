const express = require('express');
const router = express.Router();

const { createUser, loginUser, getUser, logoutUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')

//routes to handle user authentication
router.post('/login', loginUser);
router.post('/register', createUser);

//route to get user details via cookie
router.get('/getuser', authMiddleware, getUser);

//route to logout user
// router.get('/logout', logoutUser);

module.exports = router;