const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController.cjs');
const driverController = require('../controllers/driverController.cjs');  // ✅ ADD THIS
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(authMiddleware);

// ============================================
// DRIVER ROUTES
// ============================================

// ✅ Get driver's deliveries
router.get('/my-deliveries', authorize('driver'), deliveryController.getDriverDeliveries);

// ✅ Update delivery status (driver)
router.put('/:id/status', authorize('driver'), deliveryController.updateDeliveryStatus);

// ✅ Verify delivery code (driver)
router.post('/verify-code', authorize('driver'), deliveryController.verifyDeliveryCode);

// ✅ Resend delivery code (customer)
router.post('/resend-code', deliveryController.resendDeliveryCode);

// ✅ Get driver stats - FIXED: uses driverController
router.get('/driver/stats', authorize('driver'), driverController.getDriverStats);


// ============================================
// VENDOR ROUTES
// ============================================

// ✅ Get vendor's deliveries
router.get('/vendor', authorize('vendor'), deliveryController.getVendorDeliveries);

// ✅ Get available drivers (for assignment)
router.get('/available-drivers', authorize('vendor', 'admin'), deliveryController.getAvailableDrivers);

// ✅ Get pending deliveries (vendor/admin)
router.get('/pending', authorize('vendor', 'admin'), deliveryController.getPendingDeliveries);

// ✅ Create delivery (vendor/admin)
router.post('/', authorize('vendor', 'admin'), deliveryController.createDelivery);

// ✅ Assign driver to delivery (vendor/admin)
router.put('/:id/assign', authorize('vendor', 'admin'), deliveryController.assignDriver);


// ============================================
// ADMIN ROUTES
// ============================================

// ✅ Get all deliveries (admin)
router.get('/admin/all', authorize('admin'), deliveryController.getAllDeliveries);

// ✅ Get all drivers (admin)
router.get('/admin/drivers', authorize('admin'), deliveryController.getAllDrivers);

// ✅ Verify driver (admin)
router.put('/admin/drivers/:id/verify', authorize('admin'), deliveryController.verifyDriver);

// ✅ Delete driver (admin)
router.delete('/admin/drivers/:id', authorize('admin'), deliveryController.deleteDriver);


// ============================================
// SHARED ROUTES (Customer, Vendor, Driver, Admin)
// ============================================

// ✅ Get delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// ✅ Get delivery by order ID
router.get('/order/:order_id', deliveryController.getDeliveryByOrder);

// ✅ Get delivery status (customer/vendor/driver)
router.get('/:id/status', deliveryController.getDeliveryStatus);


// ============================================
// CUSTOMER ROUTES
// ============================================

// ✅ Get customer's deliveries (orders with delivery status)
router.get('/customer', authorize('customer'), deliveryController.getCustomerDeliveries);


// ============================================
// ESCROW ROUTES
// ============================================

// ✅ Get escrow status for order
router.get('/escrow/:order_id', authorize('customer', 'vendor'), deliveryController.getEscrowStatus);

// ✅ Release escrow (admin only - emergency)
router.put('/escrow/:order_id/release', authorize('admin'), deliveryController.manualReleaseEscrow);


// ============================================
// LIVESTREAM / REAL-TIME ROUTES
// ============================================

// ✅ Get live delivery updates (admin dashboard)
router.get('/live/updates', authorize('admin'), deliveryController.getLiveUpdates);

// ✅ Get delivery statistics (admin dashboard)
router.get('/stats', authorize('admin'), deliveryController.getDeliveryStats);


module.exports = router;