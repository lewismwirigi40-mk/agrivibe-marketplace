const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All routes require authentication
router.use(authMiddleware);

// Driver routes
router.get('/my-deliveries', deliveryController.getDriverDeliveries);
router.put('/:id/status', deliveryController.updateDeliveryStatus);
router.post('/verify-code', authorize('driver', 'admin'), deliveryController.verifyDeliveryCode);
router.post('/resend-code', deliveryController.resendDeliveryCode);

// Public/Shared routes
router.get('/pending', authorize('admin', 'vendor'), deliveryController.getPendingDeliveries);
router.get('/:id', deliveryController.getDeliveryById);
router.get('/order/:order_id', deliveryController.getDeliveryByOrder);

// Admin/Vendor routes
router.post('/', authorize('admin', 'vendor'), deliveryController.createDelivery);
router.put('/:id/assign', authorize('admin', 'vendor'), deliveryController.assignDriver);

module.exports = router;