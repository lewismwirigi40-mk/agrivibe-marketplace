// backend/src/routes/auditRoutes.cjs
const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth.cjs');
const auditController = require('../controllers/auditController.cjs');

// All routes require admin authentication
router.use(authMiddleware);
router.use(authorize('admin'));

// Get audit logs
router.get('/', auditController.getLogs);

// Get audit stats
router.get('/stats', auditController.getStats);

module.exports = router;