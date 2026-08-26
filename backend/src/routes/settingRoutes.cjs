// backend/src/routes/settingRoutes.cjs
const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth.cjs');
const settingController = require('../controllers/settingController.cjs');

// All routes require admin authentication
router.use(authMiddleware);
router.use(authorize('admin'));

// Get all settings
router.get('/', settingController.getAllSettings);

// Update settings
router.put('/', settingController.updateSettings);

// Get a single setting
router.get('/:key', settingController.getSetting);

module.exports = router;