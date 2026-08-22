const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post('/', authMiddleware, authorize('admin'), categoryController.createCategory);
router.put('/:id', authMiddleware, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, authorize('admin'), categoryController.deleteCategory);

module.exports = router;