const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// Protected routes (Vendor only)
router.post('/', authMiddleware, authorize('vendor', 'admin'), storeController.createStore);
router.get('/my-store', authMiddleware, authorize('vendor', 'admin'), storeController.getStoreByVendor);

module.exports = router;