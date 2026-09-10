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

        // ✅ Update last_active on each request
        await user.update({ last_active: new Date() });

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

// ✅ NEW: Admin Security Check - Combines auth + admin + IP whitelist
const adminSecurity = async (req, res, next) => {
    // First check authentication
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

        // ✅ Check if admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // ✅ Check IP whitelist
        const whitelistedIPs = process.env.ADMIN_WHITELIST_IP
            ? process.env.ADMIN_WHITELIST_IP.split(',').map(ip => ip.trim())
            : [];

        if (whitelistedIPs.length > 0) {
            const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
            const cleanIP = clientIP?.replace('::ffff:', '');

            const isWhitelisted = whitelistedIPs.some(ip => cleanIP === ip || cleanIP?.startsWith(ip));

            if (!isWhitelisted) {
                console.log(`🔴 Admin access blocked from IP: ${cleanIP}`);
                return res.status(403).json({ error: 'Access denied. IP not whitelisted.' });
            }
        }

        // ✅ Check session timeout
        const timeout = parseInt(process.env.ADMIN_SESSION_TIMEOUT) || 900000;
        if (user.last_active) {
            const lastActive = new Date(user.last_active);
            const now = new Date();
            const diff = now - lastActive;

            if (diff > timeout) {
                return res.status(401).json({ error: 'Session expired. Please login again.' });
            }
        }

        // ✅ Update last_active
        await user.update({ last_active: new Date() });

        req.user = user;
        next();

    } catch (error) {
        console.error('Admin security error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authMiddleware, authorize, adminSecurity };