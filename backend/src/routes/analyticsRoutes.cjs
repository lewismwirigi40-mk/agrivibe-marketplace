const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All routes require authentication
router.use(authMiddleware);

// Admin only routes
router.get('/dashboard', authorize('admin'), analyticsController.getDashboardStats);
router.get('/revenue', authorize('admin'), analyticsController.getRevenueAnalytics);
router.get('/revenue/period', authorize('admin'), analyticsController.getRevenueByPeriod);
router.get('/daily', authorize('admin'), analyticsController.getDailyStats);
router.get('/orders/distribution', authorize('admin'), analyticsController.getOrderStatusDistribution);
router.get('/products/top', authorize('admin'), analyticsController.getTopProducts);
router.get('/products/performance', authorize('admin'), analyticsController.getProductPerformance);
router.get('/vendors/top', authorize('admin'), analyticsController.getTopVendors);

// Vendor routes
router.get('/vendor', authorize('vendor'), analyticsController.getVendorAnalytics);

// Customer routes
router.get('/customer', analyticsController.getCustomerAnalytics);

// Driver routes
router.get('/driver', authorize('driver'), analyticsController.getDriverAnalytics);

module.exports = router;