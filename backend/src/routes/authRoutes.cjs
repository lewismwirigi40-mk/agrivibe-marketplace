// backend/src/routes/authRoutes.cjs
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// ============================================
// PUBLIC ROUTES
// ============================================

// Register
router.post('/register', authController.register);

// Login (normal users)
router.post('/login', authController.login);

// ✅ Admin routes (TOTP)
router.post('/admin-login', authController.adminLogin);
router.post('/admin-verify-totp', authController.adminVerifyTOTP);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

// ============================================
// PROTECTED ROUTES (Require Auth)
// ============================================

// Get profile
router.get('/profile', authMiddleware, authController.getProfile);

// Update profile
router.put('/profile', authMiddleware, authController.updateProfile);

// Change password
router.put('/change-password', authMiddleware, authController.changePassword);

// ============================================
// ✅ TOTP ROUTES - ADD THESE
// ============================================

// Setup TOTP (Generate QR Code)
router.post('/setup-totp', authMiddleware, authorize('admin'), authController.setupTOTP);

// Verify TOTP (Enable after verification)
router.post('/verify-totp', authMiddleware, authorize('admin'), authController.verifyTOTP);

// Disable TOTP
router.post('/disable-totp', authMiddleware, authorize('admin'), authController.disableTOTP);

// Get TOTP Status
router.get('/totp-status', authMiddleware, authorize('admin'), authController.getTOTPStatus);

module.exports = router;