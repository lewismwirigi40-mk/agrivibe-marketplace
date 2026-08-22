const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All admin routes require authentication AND admin role
router.use(authMiddleware);
router.use(authorize('admin'));

// ============================================
// DASHBOARD
// ============================================
router.get('/dashboard', adminController.getAdminDashboardStats);

// ============================================
// ANALYTICS
// ============================================
router.get('/analytics', adminController.getAnalytics);

// ============================================
// USER MANAGEMENT
// ============================================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/toggle', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// ============================================
// VENDOR MANAGEMENT
// ============================================
router.get('/vendors', adminController.getAllVendors);
router.put('/vendors/:id/approve', adminController.approveVendor);
router.put('/vendors/:id/reject', adminController.rejectVendor);

// ============================================
// PRODUCT MANAGEMENT
// ============================================
router.get('/products', adminController.getAllProducts);
router.put('/products/:id/toggle', adminController.toggleProductStatus);

// ============================================
// ORDER MANAGEMENT
// ============================================
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrder);

module.exports = router;