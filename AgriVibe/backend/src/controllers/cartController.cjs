const Cart = require('../models/Cart.cjs');
const Product = require('../models/Product.cjs');

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if product is active
        if (!product.is_active) {
            return res.status(400).json({ error: 'Product is not available' });
        }

        // Check stock
        if (product.stock_quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Check if item already in cart
        let cartItem = await Cart.findOne({
            where: { user_id, product_id }
        });

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;
            if (product.stock_quantity < newQuantity) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }
            cartItem.quantity = newQuantity;
            cartItem.total = cartItem.price * newQuantity;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = await Cart.create({
                user_id,
                product_id,
                quantity,
                price: product.price,
                total: product.price * quantity
            });
        }

        res.status(201).json({
            message: 'Item added to cart',
            cartItem
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.id;

        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [{
                model: Product,
                attributes: ['name', 'slug', 'images', 'is_active']
            }]
        });

        // Calculate totals
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += parseFloat(item.total);
        });

        res.json({
            items: cartItems,
            subtotal: subtotal,
            total_items: cartItems.length
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const cartItem = await Cart.findOne({
            where: { id, user_id }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        await cartItem.destroy();

        res.json({ message: 'Item removed from cart' });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
};

// Update Cart Quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const user_id = req.user.id;

        const cartItem = await Cart.findOne({
            where: { id, user_id },
            include: [Product]
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        // Check stock
        if (cartItem.Product.stock_quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;
        cartItem.total = cartItem.price * quantity;
        await cartItem.save();

        res.json({
            message: 'Cart updated',
            cartItem
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
};

// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        const user_id = req.user.id;

        await Cart.destroy({
            where: { user_id }
        });

        res.json({ message: 'Cart cleared' });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};