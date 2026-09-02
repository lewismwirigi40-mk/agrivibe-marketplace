const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(authMiddleware);

// ============================================
// DRIVER ROUTES (Self)
// ============================================

// ✅ Register as driver - ANY logged-in user can register
router.post('/register', driverController.registerDriver);  // ✅ REMOVED authorize

// ✅ Get driver profile - Allow driver AND admin
router.get('/profile', authorize('driver', 'admin'), driverController.getDriverProfile);

// ✅ Update driver profile - Allow driver AND admin
router.put('/profile', authorize('driver', 'admin'), driverController.updateDriverProfile);

// ✅ Toggle availability - Allow driver AND admin
router.put('/availability', authorize('driver', 'admin'), driverController.toggleAvailability);

// ✅ Update current location - Allow driver AND admin
router.put('/location', authorize('driver', 'admin'), driverController.updateLocation);

// ✅ Get driver statistics - Allow driver AND admin
router.get('/stats', authorize('driver', 'admin'), driverController.getDriverStats);

// ============================================
// ADMIN ROUTES
// ============================================

// ✅ Get all drivers (admin)
router.get('/admin/all', authorize('admin'), driverController.getAllDrivers);

// ✅ Get driver by ID (admin)
router.get('/admin/:id', authorize('admin'), driverController.getDriverById);

// ✅ Verify driver (admin) - Still available but not required
router.put('/admin/:id/verify', authorize('admin'), driverController.verifyDriver);

// ✅ Delete driver (admin)
router.delete('/admin/:id', authorize('admin'), driverController.deleteDriver);

// ============================================
// VENDOR ROUTES (View available drivers)
// ============================================

// ✅ Get available drivers (for vendor assignment)
router.get('/available', authorize('vendor', 'admin'), driverController.getAvailableDrivers);

// ============================================
// SHARED ROUTES
// ============================================

// ✅ Get driver by ID (vendor/admin)
router.get('/:id', authorize('vendor', 'admin'), driverController.getDriverById);

module.exports = router;