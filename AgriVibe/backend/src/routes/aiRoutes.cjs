const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// Public routes
router.post('/chat', aiController.chat);
router.get('/suggestions', aiController.getSuggestions);
router.get('/categories', aiController.getProduceCategories);

// Protected routes (requires login)
router.post('/unanswered', authMiddleware, aiController.saveUnansweredQuestion);

// Admin only routes
router.get('/unanswered', authMiddleware, authorize('admin'), aiController.getUnansweredQuestions);
router.put('/unanswered/:id', authMiddleware, authorize('admin'), aiController.answerQuestion);

module.exports = router;