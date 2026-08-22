const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All routes require authentication
router.use(authMiddleware);

// Release escrow (Admin only)
router.put('/:id/release', authorize('admin'), orderController.releaseEscrow);

// Get escrow status
router.get('/:id/status', orderController.getEscrowStatus);

module.exports = router;