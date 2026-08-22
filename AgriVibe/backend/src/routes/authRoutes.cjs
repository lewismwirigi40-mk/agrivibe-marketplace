const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

// ============================================
// LOCATION ROUTES
// ============================================
router.put('/location', authMiddleware, authController.updateLocation);
router.get('/location', authMiddleware, authController.getLocation);
router.put('/location/toggle', authMiddleware, authController.toggleLocationSharing);

module.exports = router;