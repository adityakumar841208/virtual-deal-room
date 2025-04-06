const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // check for token in Authorization header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            // getting token from cookies
            if (req.cookies && req.cookies.token) {
                req.token = req.cookies.token;
            } else {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }
        } else {
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({ message: 'Invalid token format' });
            }
            req.token = parts[1];
        }
        
        // verifying the token
        const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
        
        // find the user by id
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;