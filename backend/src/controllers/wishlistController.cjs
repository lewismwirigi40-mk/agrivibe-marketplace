const Wishlist = require('../models/Wishlist.cjs');
const Product = require('../models/Product.cjs');

// ============================================
// GET WISHLIST - SIMPLIFIED
// ============================================
exports.getWishlist = async (req, res) => {
    try {
        const user_id = req.user.id;

        // ✅ First get all wishlist items
        const wishlist = await Wishlist.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']]
        });

        // ✅ Then manually fetch products
        const items = [];
        for (const item of wishlist) {
            const product = await Product.findByPk(item.product_id, {
                attributes: ['id', 'name', 'price', 'images', 'stock_quantity', 'rating']
            });
            
            if (product) {
                items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    images: product.images || [],
                    stock_quantity: product.stock_quantity || 0,
                    rating: product.rating || 4.5,
                    added_at: item.created_at
                });
            }
        }

        res.json({
            success: true,
            items,
            count: items.length
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

// ============================================
// ADD TO WISHLIST
// ============================================
exports.addToWishlist = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            where: { user_id, product_id }
        });

        if (existing) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        const wishlist = await Wishlist.create({
            user_id,
            product_id
        });

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};

// ============================================
// REMOVE FROM WISHLIST
// ============================================
exports.removeFromWishlist = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;

        const wishlist = await Wishlist.findOne({
            where: { user_id, product_id: id }
        });

        if (!wishlist) {
            return res.status(404).json({ error: 'Item not found in wishlist' });
        }

        await wishlist.destroy();

        res.json({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};