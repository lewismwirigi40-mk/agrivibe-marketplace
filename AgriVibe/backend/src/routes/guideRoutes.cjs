const express = require('express');
const router = express.Router();

const guideController = require('../controllers/guideController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all active guides
router.get('/', guideController.getGuides);


// ============================================
// PROTECTED ROUTES
// Requires authentication
// ============================================

router.use(authMiddleware);

// Purchase a guide
router.post('/purchase', guideController.purchaseGuide);

// Confirm a guide purchase
router.post('/confirm', guideController.confirmPurchase);

// Get the current user's purchased guides
router.get('/my-guides', guideController.getMyGuides);

// Download a purchased guide
router.get('/download/:token', guideController.downloadGuide);


// ============================================
// ADMIN ROUTES
// ============================================

// Create a guide
router.post('/', authorize('admin'), guideController.createGuide);

// Update a guide
router.put('/:id', authorize('admin'), guideController.updateGuide);

// Delete a guide
router.delete('/:id', authorize('admin'), guideController.deleteGuide);


// ============================================
// PUBLIC GUIDE DETAIL
// IMPORTANT: This MUST be after /my-guides
// and /download/:token.
// ============================================

router.get('/:slug', guideController.getGuideBySlug);


module.exports = router;