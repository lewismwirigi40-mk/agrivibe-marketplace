const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// 🟢 IMPORT THE MODELS NEEDED FOR THE STATS COUNTS
const Product = require('../models/Product.cjs');
const Store = require('../models/Store.cjs');
const Campus = require('../models/Campus.cjs');

// Test route to verify it works
router.get('/test', (req, res) => {
    res.json({ message: 'Product routes are working!' });
});

// ============================================
// PUBLIC ROUTES (ORDER MATTERS!)
// ============================================

// 1. Base root paths
router.get('/', productController.getAllProducts);
router.get('/nearby', productController.getNearbyProducts);

// 2. 🟢 FIXED: Static string paths must come BEFORE dynamic /:id parameter
router.get('/public-stats', async (req, res) => {
    try {
        const totalProducts = await Product.count();
        const totalVendors = await Store.count(); 
        const totalCampuses = await Campus.count() || 4; // Pull dynamic count or fallback to 4
        
        return res.json({ 
            stats: { 
                totalProducts, 
                totalVendors, 
                totalCampuses, 
                satisfaction: 95 
            } 
        });
    } catch (error) {
        console.error('❌ Public stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch public statistics' });
    }
});

// 3. Namespace routes
router.get('/store/:storeId', productController.getStoreProducts);

// 4. 🛑 MOVED TO THE BOTTOM: Dynamic wildcard matches everything else
router.get('/:id', productController.getProductById);


// ============================================
// PROTECTED ROUTES
// ============================================
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
