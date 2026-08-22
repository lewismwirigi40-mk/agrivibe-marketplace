const Review = require('../models/Review.cjs');
const Product = require('../models/Product.cjs');
const Order = require('../models/Order.cjs');

// Create Review
exports.createReview = async (req, res) => {
    try {
        const { product_id, rating, title, comment, order_id } = req.body;
        const user_id = req.user.id;

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            where: { product_id, user_id }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Check if user purchased this product (if order_id provided)
        let is_verified_purchase = false;
        if (order_id) {
            const order = await Order.findOne({
                where: { id: order_id, customer_id: user_id, status: 'delivered' }
            });
            if (order) {
                is_verified_purchase = true;
            }
        }

        const review = await Review.create({
            product_id,
            user_id,
            order_id,
            rating,
            title,
            comment,
            is_verified_purchase,
            is_approved: true
        });

        // Update product rating
        const reviews = await Review.findAll({
            where: { product_id, is_approved: true }
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await product.update({ rating: avgRating });

        res.status(201).json({
            message: 'Review created successfully',
            review
        });

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Get Reviews for Product
exports.getProductReviews = async (req, res) => {
    try {
        const { product_id } = req.params;

        const reviews = await Review.findAll({
            where: { product_id, is_approved: true },
            order: [['created_at', 'DESC']]
        });

        res.json({ reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// Get Review by ID
exports.getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ review });
    } catch (error) {
        console.error('Get review error:', error);
        res.status(500).json({ error: 'Failed to fetch review' });
    }
};

// Update Review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;
        const user_id = req.user.id;

        const review = await Review.findOne({
            where: { id, user_id }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await review.update({ rating, title, comment });

        // Update product rating
        const product = await Product.findByPk(review.product_id);
        const reviews = await Review.findAll({
            where: { product_id: review.product_id, is_approved: true }
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await product.update({ rating: avgRating });

        res.json({
            message: 'Review updated successfully',
            review
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};

// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const review = await Review.findOne({
            where: { id, user_id }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await review.destroy();

        // Update product rating
        const product = await Product.findByPk(review.product_id);
        const reviews = await Review.findAll({
            where: { product_id: review.product_id, is_approved: true }
        });

        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await product.update({ rating: avgRating });
        } else {
            await product.update({ rating: 0 });
        }

        res.json({ message: 'Review deleted successfully' });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        review.helpful_count += 1;
        await review.save();

        res.json({
            message: 'Review marked as helpful',
            helpful_count: review.helpful_count
        });

    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ error: 'Failed to mark review as helpful' });
    }
};