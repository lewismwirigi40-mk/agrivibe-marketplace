const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// TEST ROUTE - Verify cart routes are working
router.get('/test', (req, res) => {
    res.json({ message: 'Cart routes are working!' });
});

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/:id', cartController.updateQuantity);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;