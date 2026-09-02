const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// Public routes
router.get('/product/:product_id', reviewController.getProductReviews);
router.get('/my-reviews', reviewController.getMyReviews);  
router.get('/:id', reviewController.getReviewById);

// Protected routes (Customer)
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.put('/:id/helpful', authMiddleware, reviewController.markHelpful);

// Admin routes
router.delete('/admin/:id', authMiddleware, authorize('admin'), reviewController.deleteReview);

module.exports = router;