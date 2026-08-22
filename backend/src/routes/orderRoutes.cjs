const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All routes require authentication
router.use(authMiddleware);

// Customer routes
router.post('/checkout', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Vendor routes
router.get('/vendor/orders', authorize('vendor'), orderController.getVendorOrders);
router.put('/:id/status', authorize('vendor', 'admin'), orderController.updateOrderStatus);

module.exports = router;