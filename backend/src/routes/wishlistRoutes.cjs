const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);

module.exports = router;