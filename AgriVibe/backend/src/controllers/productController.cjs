const Product = require('../models/Product.cjs');
const { v4: uuidv4 } = require('uuid');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const { 
            name, description, price, compare_price, cost_price,
            stock_quantity, unit, category_id, is_featured,
            weight, weight_unit, images
        } = req.body;

        // Generate a unique slug from the name
        const baseSlug = (name || 'product')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'product';

        let slug = baseSlug;
        let counter = 1;

        while (await Product.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter += 1;
        }

        const product = await Product.create({
            store_id: req.user.id,
            owner_id: req.user.id,
            name,
            slug,
            description,
            price,
            compare_price,
            cost_price,
            stock_quantity: stock_quantity || 0,
            unit: unit || 'piece',
            category_id,
            is_featured: is_featured || false,
            weight,
            weight_unit: weight_unit || 'kg',
            images: images || []
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            error: 'Failed to create product',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_active: true },
            order: [['created_at', 'DESC']]
        });

        res.json({ products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.update(req.body);

        res.json({
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy();

        res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// Get Products by Store
exports.getStoreProducts = async (req, res) => {
    try {
        const { storeId } = req.params;
        const products = await Product.findAll({
            where: { store_id: storeId, is_active: true },
            order: [['created_at', 'DESC']]
        });

        res.json({ products });
    } catch (error) {
        console.error('Get store products error:', error);
        res.status(500).json({ error: 'Failed to fetch store products' });
    }
};