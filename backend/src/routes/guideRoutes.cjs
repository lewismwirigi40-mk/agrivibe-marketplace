const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all active guides
router.get('/', guideController.getGuides);

// Get guide by slug (MUST BE AFTER ALL STATIC ROUTES)
router.get('/:slug', guideController.getGuideBySlug);

// ============================================
// PROTECTED ROUTES (Require Auth)
// ============================================

router.use(authMiddleware);

// Purchase a guide
router.post('/purchase', guideController.purchaseGuide);

// Confirm a guide purchase (M-Pesa callback)
router.post('/confirm', guideController.confirmPurchase);

// Get user's purchased guides
router.get('/my-guides', guideController.getMyGuides);

// Download a purchased guide
router.get('/download/:token', guideController.downloadGuide);

// Check purchase status for a specific guide
router.get('/purchase-status/:guide_id', guideController.getPurchaseStatus);

// ============================================
// ADMIN ROUTES
// ============================================

// Create a guide
router.post('/', authorize('admin'), guideController.createGuide);

// Get all guides (admin view with stats)
router.get('/admin/all', authorize('admin'), guideController.adminGetGuides);

// Update a guide
router.put('/:id', authorize('admin'), guideController.updateGuide);

// Delete a guide
router.delete('/:id', authorize('admin'), guideController.deleteGuide);

module.exports = router;