// Force console logs to show immediately
console.log('🔥 AUTH CONTROLLER LOADED');
const User = require('../models/User.cjs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
    );
};

// Register
exports.register = async (req, res) => {
    console.log('🔥 REGISTER FUNCTION CALLED'); // ✅ Force log
    console.log('📝 Request body:', req.body); // ✅ Force log

    try {
        const { email, password, first_name, last_name, phone, role } = req.body;

        console.log('🔍 Checking if user exists:', email); // ✅ Force log

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('❌ User already exists:', email); // ✅ Force log
            return res.status(400).json({ error: 'Email already registered' });
        }

        console.log('✅ User does not exist, creating...'); // ✅ Force log

        // Create user
        const user = await User.create({
            email,
            password_hash: password,
            first_name,
            last_name,
            phone,
            role: role || 'customer'
        });

        console.log('✅ User created successfully:', user.id); // ✅ Force log

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('❌ REGISTRATION ERROR:', error.message); // ✅ Force log
        console.error('❌ Full error:', error); // ✅ Force log
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await user.update({ last_login: new Date() });

        // Generate token
        const token = generateToken(user);

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                is_verified: user.is_verified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            error: 'Login failed',
            message: error.message 
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    return res.json({ message: 'Logged out successfully' });
};

// Verify OTP (placeholder)
exports.verifyOTP = async (req, res) => {
    return res.json({ message: 'OTP verification endpoint' });
};

// Resend OTP (placeholder)
exports.resendOTP = async (req, res) => {
    return res.json({ message: 'Resend OTP endpoint' });
};

// Forgot Password (placeholder)
exports.forgotPassword = async (req, res) => {
    return res.json({ message: 'Forgot password endpoint' });
};

// Reset Password (placeholder)
exports.resetPassword = async (req, res) => {
    return res.json({ message: 'Reset password endpoint' });
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// ============================================
// USER LOCATION FUNCTIONS (GOOGLE MAPS INTEGRATION)
// ============================================

// Update User Location
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, location_address } = req.body;
        // Assume req.user is populated by authentication middleware
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate input
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ 
                error: 'Latitude and longitude are required' 
            });
        }

        // Validate range
        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({ error: 'Invalid latitude' });
        }
        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid longitude' });
        }

        // Update user location
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            latitude: latitude,
            longitude: longitude,
            location_address: location_address || user.location_address,
            location_updated_at: new Date(),
            location_sharing_enabled: true
        });

        return res.json({
            message: 'Location updated successfully',
            user: {
                id: user.id,
                latitude: user.latitude,
                longitude: user.longitude,
                location_address: user.location_address,
                location_updated_at: user.location_updated_at
            }
        });

    } catch (error) {
        console.error('Update location error:', error);
        return res.status(500).json({ error: 'Failed to update location' });
    }
};

// Get User Location
exports.getLocation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId, {
            attributes: ['id', 'latitude', 'longitude', 'location_address', 'location_updated_at', 'location_sharing_enabled']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ location: user });

    } catch (error) {
        console.error('Get location error:', error);
        return res.status(500).json({ error: 'Failed to get location' });
    }
};

// Toggle Location Sharing
exports.toggleLocationSharing = async (req, res) => {
    try {
        const { enabled } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            location_sharing_enabled: enabled !== undefined ? enabled : !user.location_sharing_enabled
        });

        return res.json({
            message: 'Location sharing preference updated',
            location_sharing_enabled: user.location_sharing_enabled
        });

    } catch (error) {
        console.error('Toggle location sharing error:', error);
        return res.status(500).json({ error: 'Failed to update preference' });
    }
};
