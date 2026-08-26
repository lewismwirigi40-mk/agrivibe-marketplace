// backend/src/routes/dashboardRoutes.cjs
const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth.cjs');
const dashboardController = require('../controllers/dashboardController.cjs');

// All routes require admin authentication
router.use(authMiddleware);
router.use(authorize('admin'));

// Get dashboard stats
router.get('/stats', dashboardController.getStats);

// Get chart data
router.get('/chart', dashboardController.getChartData);

module.exports = router;