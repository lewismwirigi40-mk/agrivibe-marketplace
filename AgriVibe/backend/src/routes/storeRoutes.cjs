const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');
// Add this line after the existing routes
router.put('/location', authMiddleware, authorize('vendor', 'admin'), storeController.updateStoreLocation);
// Protected routes (Vendor only)
router.post('/', authMiddleware, authorize('vendor', 'admin'), storeController.createStore);
router.get('/my-store', authMiddleware, authorize('vendor', 'admin'), storeController.getStoreByVendor);

module.exports = router;