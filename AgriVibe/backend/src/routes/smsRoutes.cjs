const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

console.log('🔧 Loading SMS routes...');

// All SMS routes require authentication
router.use(authMiddleware);

// Test SMS endpoint
router.post('/test', smsController.sendTestSms);

console.log('✅ SMS routes loaded');

module.exports = router;