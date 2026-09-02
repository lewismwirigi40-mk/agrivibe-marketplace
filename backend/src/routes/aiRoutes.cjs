const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

console.log('🔥 AI ROUTES LOADED');

// ====== PUBLIC ROUTES (No authentication required) ======
router.post('/chat', aiController.chat);
router.get('/suggestions', aiController.getSuggestions);
router.get('/categories', aiController.getProduceCategories);

// ====== PROTECTED ROUTES (Requires login) ======
router.post('/unanswered', authMiddleware, aiController.saveUnansweredQuestion);

// ====== ADMIN ONLY ROUTES ======

// ✅ GET all unanswered questions (status: 'pending')
router.get('/unanswered', authMiddleware, authorize('admin'), aiController.getUnansweredQuestions);

// ✅ GET all answered questions (status: 'answered')
router.get('/answered', authMiddleware, authorize('admin'), aiController.getAnsweredQuestions);

// ✅ GET single question by ID (admin only)
router.get('/questions/:id', authMiddleware, authorize('admin'), aiController.getQuestionById);

// ✅ PUT - Answer a question (marks as answered)
router.put('/unanswered/:id', authMiddleware, authorize('admin'), aiController.answerQuestion);

// ✅ DELETE - Delete a question (optional cleanup)
router.delete('/questions/:id', authMiddleware, authorize('admin'), aiController.deleteQuestion);

// ====== EXPORT ROUTER ======
module.exports = router;