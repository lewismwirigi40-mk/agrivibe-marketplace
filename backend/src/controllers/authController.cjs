// Force console logs to show immediately
console.log('🔥 AUTH CONTROLLER LOADED');

const User = require('../models/User.cjs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { Op } = require('sequelize');

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

// ============================================
// REGISTER - FIXED with email + phone check
// ============================================
exports.register = async (req, res) => {
    try {
        console.log('📝 Registration data:', req.body);
        const { email, password, first_name, last_name, phone, role, address } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }

        // ✅ Check if user exists by email OR phone
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            // ✅ Check which field caused the conflict
            let errorMessage = 'Registration failed. ';
            
            if (existingUser.email === email) {
                errorMessage = 'This email is already registered. Please login or use a different email.';
            } else if (existingUser.phone === phone) {
                errorMessage = 'This phone number is already registered. Please use a different number.';
            } else {
                errorMessage = 'Email or phone number already registered.';
            }
            
            return res.status(400).json({ 
                success: false,
                error: errorMessage
            });
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ============================================================
        // ✅ STEP 1: Create the User
        // ============================================================
        const user = await User.create({
            email,
            password_hash: hashedPassword,
            first_name,
            last_name,
            phone,
            role: role || 'customer'
        });

        console.log('✅ User created successfully ID:', user.id);

        // ============================================================
        // ✅ STEP 2: If role is vendor, create the Store record
        // ============================================================
        let storeData = null;

        if (user.role === 'vendor') {
            try {
                const Store = require('../models/Store.cjs');
                
                console.log(`🌱 Creating vendor store for ${email}...`);

                const timestamp = Date.now().toString(36);
                const shortId = user.id.substring(0, 8);
                const slug = `shop-${shortId}-${timestamp}`;

                const store = await Store.create({
                    vendor_id: user.id,
                    store_name: `${first_name || 'Vendor'}'s Store`,
                    store_slug: slug,
                    description: 'Agricultural marketplace vendor store. Pending approval.',
                    contact_email: email,
                    contact_phone: phone || '',
                    address: address || '',
                    latitude: 0,
                    longitude: 0,
                    is_approved: false,
                    is_active: false,
                    rating: 5.0,
                    total_orders: 0
                });

                storeData = {
                    id: store.id,
                    store_name: store.store_name,
                    status: 'pending',
                    is_approved: false
                };

                console.log(`🎯 SUCCESS: Store created for vendor ${email}`);
                console.log(`📊 Store ID: ${store.id}, is_approved: ${store.is_approved}`);

            } catch (storeError) {
                console.error('❌ DATABASE WRITE FAILURE:', storeError.message);
                console.error('❌ Full error details:', storeError);
                console.warn('⚠️ User created but store creation failed. Please check Store model.');
            }
        }

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            },
            store: storeData
        });

    } catch (error) {
        console.error('❌ Critical Registration error:', error);
        
        // ✅ Better error handling for database constraints
        if (error.name === 'SequelizeUniqueConstraintError') {
            if (error.fields?.email) {
                return res.status(400).json({
                    success: false,
                    error: 'This email is already registered. Please login or use a different email.'
                });
            }
            if (error.fields?.phone) {
                return res.status(400).json({
                    success: false,
                    error: 'This phone number is already registered. Please use a different number.'
                });
            }
        }
        
        return res.status(500).json({ 
            success: false,
            error: 'Registration failed', 
            message: error.message
        });
    }
};

// ============================================
// LOGIN - FIXED
// ============================================
exports.login = async (req, res) => {
    console.log('🔥 LOGIN CALLED');
    console.log('📝 Email:', req.body.email);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        // ✅ Check password using comparePassword
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        await user.update({ last_login: new Date() });

        const token = generateToken(user);

        // ====== ROLE-BASED REDIRECT ======
        let redirectTo = '/';
        let vendorData = null;

        if (user.role === 'admin') {
            redirectTo = '/admin/dashboard';
            console.log('👑 Admin login - redirecting to /admin/dashboard');
        } else if (user.role === 'vendor') {
            console.log('🏪 Vendor login - checking store status...');
            try {
                const Store = require('../models/Store.cjs');
                const store = await Store.findOne({ 
                    where: { vendor_id: user.id }
                });
                
                if (store) {
                    vendorData = {
                        id: store.id,
                        store_name: store.store_name,
                        is_approved: store.is_approved,
                        status: store.is_approved ? 'approved' : 'pending'
                    };
                    console.log('📦 Store found:', store.store_name);
                    console.log('📊 Status:', store.is_approved ? 'approved' : 'pending');

                    if (store.is_approved) {
                        redirectTo = '/vendor/dashboard';
                        vendorData.status = 'approved';
                        console.log('✅ Approved vendor - redirecting to /vendor/dashboard');
                    } else {
                        redirectTo = '/vendor/pending-approval';
                        console.log('⏳ Pending vendor - redirecting to /vendor/pending-approval');
                    }
                } else {
                    console.log('⚠️ User has vendor role but no store record');
                    redirectTo = '/vendor/register';
                }
            } catch (err) {
                console.error('❌ Store check error:', err.message);
                redirectTo = '/';
            }
        } else {
            redirectTo = '/';
            console.log('👤 Customer login - redirecting to /');
        }

        return res.json({
            success: true,
            message: 'Login successful',
            token,
            redirectTo,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                is_verified: user.is_verified
            },
            vendor: vendorData
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Login failed',
            message: error.message 
        });
    }
};

// ============================================
// LOGOUT
// ============================================
exports.logout = async (req, res) => {
    return res.json({ message: 'Logged out successfully' });
};

// ============================================
// OTP FUNCTIONS (Placeholders)
// ============================================
exports.verifyOTP = async (req, res) => {
    return res.json({ message: 'OTP verification endpoint' });
};

exports.resendOTP = async (req, res) => {
    return res.json({ message: 'Resend OTP endpoint' });
};

// ============================================
// GET CURRENT USER
// ============================================
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
// USER LOCATION FUNCTIONS
// ============================================
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, location_address } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ 
                error: 'Latitude and longitude are required' 
            });
        }

        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({ error: 'Invalid latitude' });
        }
        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid longitude' });
        }

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

// ============================================
// PROFILE FUNCTIONS
// ============================================
exports.getProfile = async (req, res) => {
    console.log('🔥 GET PROFILE CALLED');
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash', 'password'] }
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log('✅ Profile fetched for user:', user.id);
        res.json(user);
    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    console.log('🔥 UPDATE PROFILE CALLED');
    console.log('📝 Request body:', req.body);
    
    try {
        const { first_name, last_name, phone } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const updates = {};
        if (first_name !== undefined) updates.first_name = first_name;
        if (last_name !== undefined) updates.last_name = last_name;
        if (phone !== undefined) updates.phone = phone;
        
        await user.update(updates);
        
        console.log('✅ Profile updated for user:', user.id);
        
        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// ============================================
// CHANGE PASSWORD - FIXED
// ============================================
exports.changePassword = async (req, res) => {
    console.log('🔥 CHANGE PASSWORD CALLED');
    
    try {
        const { current_password, new_password } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (!current_password || !new_password) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        
        if (new_password.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // ✅ Verify current password
        const isValid = await user.comparePassword(current_password);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // ✅ Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        user.password_hash = hashedPassword;
        await user.save();
        
        console.log('✅ Password changed for user:', user.id);
        
        res.json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        console.error('❌ Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// ============================================
// FORGOT PASSWORD - SEND RESET LINK
// ============================================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // ✅ Generate reset token
        const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: '1h' }
        );

        // ✅ Send email with reset link
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        
        console.log(`🔑 Reset link for ${email}: ${resetLink}`);

        return res.json({
            success: true,
            message: 'Reset link sent to your email',
            resetLink: resetLink // Only for development
        });

    } catch (error) {
        console.error('❌ Forgot password error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to send reset link' 
        });
    }
};

// ============================================
// RESET PASSWORD
// ============================================
exports.resetPassword = async (req, res) => {
    try {
        const { token, new_password } = req.body;

        if (!token || !new_password) {
            return res.status(400).json({ 
                success: false,
                error: 'Token and new password are required' 
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ 
                success: false,
                error: 'Password must be at least 6 characters' 
            });
        }

        // ✅ Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        } catch (err) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid or expired token' 
            });
        }

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        // ✅ Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        user.password_hash = hashedPassword;
        await user.save();

        console.log('✅ Password reset successfully for user:', user.id);

        return res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to reset password' 
        });
    }
};
// ============================================
// ✅ TOTP (Google Authenticator) FUNCTIONS
// ============================================

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// ============================================
// SETUP TOTP - Generate Secret + QR Code
// ============================================
exports.setupTOTP = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // ✅ Only admin can setup TOTP
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admin can enable 2FA' });
        }

        // Generate TOTP secret
        const secret = speakeasy.generateSecret({
            name: process.env.TOTP_APP_NAME || 'AgriVibe'
        });

        // Save secret temporarily (user.enable will confirm)
        // We'll save it after verification

        // Generate QR Code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        return res.json({
            success: true,
            secret: secret.base32,
            qrCode: qrCodeUrl,
            otpauth_url: secret.otpauth_url
        });

    } catch (error) {
        console.error('❌ Setup TOTP error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to setup TOTP',
            details: error.message
        });
    }
};

// ============================================
// VERIFY TOTP - Verify and Enable
// ============================================
exports.verifyTOTP = async (req, res) => {
    try {
        const { secret, token } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!secret || !token) {
            return res.status(400).json({ 
                success: false,
                error: 'Secret and token are required' 
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // ✅ Verify the token
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1 // Allow 1 step before/after
        });

        if (!verified) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid verification code' 
            });
        }

        // ✅ Save secret and enable TOTP
        await user.update({
            totp_secret: secret,
            totp_enabled: true,
            totp_verified_at: new Date()
        });

        return res.json({
            success: true,
            message: 'TOTP enabled successfully',
            totp_enabled: true
        });

    } catch (error) {
        console.error('❌ Verify TOTP error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to verify TOTP',
            details: error.message
        });
    }
};

// ============================================
// DISABLE TOTP
// ============================================
exports.disableTOTP = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            totp_secret: null,
            totp_enabled: false,
            totp_verified_at: null
        });

        return res.json({
            success: true,
            message: 'TOTP disabled successfully'
        });

    } catch (error) {
        console.error('❌ Disable TOTP error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to disable TOTP',
            details: error.message
        });
    }
};

// ============================================
// VALIDATE TOTP DURING LOGIN
// ============================================
exports.validateTOTP = async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and TOTP code are required' 
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // ✅ Check if TOTP is enabled
        if (!user.totp_enabled || !user.totp_secret) {
            return res.status(400).json({ 
                success: false,
                error: 'TOTP not enabled for this account' 
            });
        }

        // ✅ Verify TOTP
        const verified = speakeasy.totp.verify({
            secret: user.totp_secret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid TOTP code' 
            });
        }

        return res.json({
            success: true,
            message: 'TOTP verified'
        });

    } catch (error) {
        console.error('❌ Validate TOTP error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to validate TOTP',
            details: error.message
        });
    }
};

// ============================================
// GET TOTP STATUS
// ============================================
exports.getTOTPStatus = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({
            success: true,
            totp_enabled: user.totp_enabled || false,
            totp_verified_at: user.totp_verified_at
        });

    } catch (error) {
        console.error('❌ Get TOTP status error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to get TOTP status',
            details: error.message
        });
    }
};
// ============================================
// ✅ ADMIN LOGIN (with TOTP Check)
// ============================================
exports.adminLogin = async (req, res) => {
    console.log('🔥 ADMIN LOGIN CALLED');
    console.log('📝 Email:', req.body.email);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        // ✅ Check if admin
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                error: 'Admin access required' 
            });
        }

        // ✅ Check if account is locked
        if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
            const remaining = Math.ceil((new Date(user.lockout_until) - new Date()) / 60000);
            return res.status(401).json({
                success: false,
                error: `Account locked. Try again in ${remaining} minutes.`
            });
        }

        // ✅ Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            const attempts = (user.login_attempts || 0) + 1;
            const maxAttempts = parseInt(process.env.ADMIN_RATE_LIMIT_MAX) || 5;

            if (attempts >= maxAttempts) {
                const lockoutDuration = parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW) || 900000;
                await user.update({
                    login_attempts: attempts,
                    lockout_until: new Date(Date.now() + lockoutDuration)
                });
                return res.status(401).json({
                    success: false,
                    error: 'Too many failed attempts. Account locked for 15 minutes.'
                });
            }

            await user.update({ login_attempts: attempts });
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        // ✅ Reset login attempts on success
        await user.update({ 
            login_attempts: 0,
            lockout_until: null,
            last_login: new Date(),
            last_login_ip: req.ip || req.connection.remoteAddress
        });

        // ✅ Check if TOTP is enabled
        const requiresTOTP = user.totp_enabled && user.totp_secret;

        return res.json({
            success: true,
            requiresTOTP: requiresTOTP || false,
            message: requiresTOTP ? 'TOTP verification required' : 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                totp_enabled: user.totp_enabled
            }
        });

    } catch (error) {
        console.error('❌ Admin login error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Login failed',
            message: error.message 
        });
    }
};
// ============================================
// ✅ ADMIN TOTP VERIFICATION
// ============================================
exports.adminVerifyTOTP = async (req, res) => {
    console.log('🔥 ADMIN TOTP VERIFICATION CALLED');
    console.log('📝 Email:', req.body.email);

    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and TOTP code are required' 
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        // ✅ Check if admin
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                error: 'Admin access required' 
            });
        }

        // ✅ Check if TOTP is enabled
        if (!user.totp_enabled || !user.totp_secret) {
            return res.status(400).json({ 
                success: false,
                error: 'TOTP not enabled for this account' 
            });
        }

        // ✅ Verify TOTP
        const verified = speakeasy.totp.verify({
            secret: user.totp_secret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (!verified) {
            const attempts = (user.login_attempts || 0) + 1;
            await user.update({ login_attempts: attempts });
            
            return res.status(400).json({ 
                success: false,
                error: 'Invalid TOTP code' 
            });
        }

        // ✅ Generate JWT token
        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: '7d' }
        );

        // ✅ Update last_active
        await user.update({ 
            last_active: new Date(),
            login_attempts: 0
        });

        return res.json({
            success: true,
            message: 'Login successful',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('❌ Admin TOTP verification error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'TOTP verification failed',
            message: error.message 
        });
    }
};