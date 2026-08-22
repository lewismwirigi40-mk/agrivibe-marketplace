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
    try {
        const { email, password, first_name, last_name, phone, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            email,
            password_hash: password,
            first_name,
            last_name,
            phone,
            role: role || 'customer'
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
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
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

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

        res.json({
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
        res.status(500).json({ error: 'Login failed' });
    }
};

// Logout
exports.logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// Verify OTP (placeholder)
exports.verifyOTP = async (req, res) => {
    res.json({ message: 'OTP verification endpoint' });
};

// Resend OTP (placeholder)
exports.resendOTP = async (req, res) => {
    res.json({ message: 'Resend OTP endpoint' });
};

// Forgot Password (placeholder)
exports.forgotPassword = async (req, res) => {
    res.json({ message: 'Forgot password endpoint' });
};

// Reset Password (placeholder)
exports.resetPassword = async (req, res) => {
    res.json({ message: 'Reset password endpoint' });
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

        res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ============================================
// USER LOCATION FUNCTIONS (GOOGLE MAPS INTEGRATION)
// ============================================

// Update User Location
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, location_address } = req.body;
        const userId = req.user.id;

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

        res.json({
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
        res.status(500).json({ error: 'Failed to update location' });
    }
};

// Get User Location
exports.getLocation = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'latitude', 'longitude', 'location_address', 'location_updated_at', 'location_sharing_enabled']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ location: user });

    } catch (error) {
        console.error('Get location error:', error);
        res.status(500).json({ error: 'Failed to get location' });
    }
};

// Toggle Location Sharing
exports.toggleLocationSharing = async (req, res) => {
    try {
        const { enabled } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            location_sharing_enabled: enabled !== undefined ? enabled : !user.location_sharing_enabled
        });

        res.json({
            message: 'Location sharing preference updated',
            location_sharing_enabled: user.location_sharing_enabled
        });

    } catch (error) {
        console.error('Toggle location sharing error:', error);
        res.status(500).json({ error: 'Failed to update preference' });
    }
};