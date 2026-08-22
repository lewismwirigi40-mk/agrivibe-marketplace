const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!user.is_active) {
            return res.status(401).json({ error: 'Account is disabled' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Role authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };