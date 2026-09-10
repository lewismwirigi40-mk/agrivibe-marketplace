// backend/src/routes/liveRoutes.cjs
const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All live routes require authentication AND admin role
router.use(authMiddleware);
router.use(authorize('admin'));

// ✅ Get live dashboard stats
router.get('/stats', liveController.getLiveStats);

module.exports = router;