const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// Test route to verify it works
router.get('/test', (req, res) => {
    res.json({ message: 'Product routes are working!' });
});

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/store/:storeId', productController.getStoreProducts);

// Protected routes
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;