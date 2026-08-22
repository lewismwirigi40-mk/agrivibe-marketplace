// backend/src/routes/userRoutes.cjs
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// Get user profile
router.get('/profile', authMiddleware, authController.getCurrentUser);

// Update user location - using authController
router.put('/location', authMiddleware, authController.updateLocation);

// Get user location - using authController
router.get('/location', authMiddleware, authController.getLocation);

// Toggle location sharing - using authController
router.put('/location/toggle', authMiddleware, authController.toggleLocationSharing);

module.exports = router;