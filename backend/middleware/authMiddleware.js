const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            // Also try getting token from cookies
            if (req.cookies && req.cookies.token) {
                req.token = req.cookies.token;
            } else {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }
        } else {
            // Format: "Bearer token"
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({ message: 'Invalid token format' });
            }
            req.token = parts[1];
        }
        
        // Verify the token
        const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
        
        // Find the user by ID
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;