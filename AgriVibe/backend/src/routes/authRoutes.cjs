const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.cjs');
// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Resend OTP
router.post('/resend-otp', authController.resendOTP);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Get Current User
router.get('/me', authController.getCurrentUser);

module.exports = router;