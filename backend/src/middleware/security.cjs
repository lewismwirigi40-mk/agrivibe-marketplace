// backend/src/middleware/security.cjs
const rateLimit = require('express-rate-limit');
const User = require('../models/User.cjs');

// ============================================
// 1. IP WHITELISTING
// ============================================
const whitelistedIPs = process.env.ADMIN_WHITELIST_IP
    ? process.env.ADMIN_WHITELIST_IP.split(',').map(ip => ip.trim())
    : [];

exports.checkIPWhitelist = (req, res, next) => {
    // Skip if no IPs whitelisted (development)
    if (whitelistedIPs.length === 0) {
        return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

    // Remove IPv6 prefix if present
    const cleanIP = clientIP?.replace('::ffff:', '');

    // Check if IP is whitelisted
    const isWhitelisted = whitelistedIPs.some(ip => {
        return cleanIP === ip || cleanIP?.startsWith(ip);
    });

    if (!isWhitelisted) {
        console.log(`🔴 Blocked access from IP: ${cleanIP}`);
        return res.status(403).json({
            success: false,
            error: 'Access denied. Your IP is not whitelisted.'
        });
    }

    next();
};

// ============================================
// 2. RATE LIMITING
// ============================================
exports.adminRateLimiter = rateLimit({
    windowMs: parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW) || 900000, // 15 min
    max: parseInt(process.env.ADMIN_RATE_LIMIT_MAX) || 5,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

// ============================================
// 3. SESSION TIMEOUT CHECK
// ============================================
exports.checkSessionTimeout = async (req, res, next) => {
    // Skip if not admin route
    if (!req.path.includes('/admin')) {
        return next();
    }

    const timeout = parseInt(process.env.ADMIN_SESSION_TIMEOUT) || 900000; // 15 min

    if (req.user && req.user.last_active) {
        const lastActive = new Date(req.user.last_active);
        const now = new Date();
        const diff = now - lastActive;

        if (diff > timeout) {
            // Session expired
            return res.status(401).json({
                success: false,
                error: 'Session expired. Please login again.'
            });
        }

        // Update last active timestamp (but not on every request)
        if (diff > 60000) { // Only update every minute
            await User.update(
                { last_active: now },
                { where: { id: req.user.id } }
            );
        }
    }

    next();
};

// ============================================
// 4. LOGIN ATTEMPTS TRACKING
// ============================================
exports.trackLoginAttempt = async (email, success) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return;

        if (success) {
            // Reset attempts on successful login
            await user.update({
                login_attempts: 0,
                lockout_until: null,
                last_login: new Date()
            });
        } else {
            // Increment attempts
            const attempts = (user.login_attempts || 0) + 1;
            const maxAttempts = parseInt(process.env.ADMIN_RATE_LIMIT_MAX) || 5;

            if (attempts >= maxAttempts) {
                // Lock out for 15 minutes
                const lockoutDuration = parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW) || 900000;
                const lockoutUntil = new Date(Date.now() + lockoutDuration);
                await user.update({
                    login_attempts: attempts,
                    lockout_until: lockoutUntil
                });
            } else {
                await user.update({ login_attempts: attempts });
            }
        }
    } catch (error) {
        console.error('Track login attempt error:', error);
    }
};

exports.isAccountLocked = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return false;

        if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
            return {
                locked: true,
                remaining: Math.ceil((new Date(user.lockout_until) - new Date()) / 60000),
                message: `Account locked. Try again in ${Math.ceil((new Date(user.lockout_until) - new Date()) / 60000)} minutes.`
            };
        }

        return { locked: false };
    } catch (error) {
        console.error('Check account lock error:', error);
        return { locked: false };
    }
};