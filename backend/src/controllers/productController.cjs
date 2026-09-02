// backend/src/controllers/productController.cjs
const Product = require('../models/Product.cjs');
const Store = require('../models/Store.cjs');
const Category = require('../models/Category.cjs');
const Campus = require('../models/Campus.cjs');
const { Op } = require('sequelize');
const { calculateDistance } = require('../services/mapsService.cjs');

const DEFAULT_RADIUS = 15; // 15km radius for nearby products

// ============================================
// CREATE PRODUCT
// ============================================
exports.createProduct = async (req, res) => {
    try {
        const { 
            name, description, price, compare_price, cost_price,
            stock_quantity, unit, category_id, is_featured,
            weight, weight_unit, images
        } = req.body;

        // ✅ Find the vendor's store first
        const store = await Store.findOne({
            where: { user_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'Store not found for this vendor'
            });
        }

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
            store_id: store.id,
            name,
            slug,
            description: description || '',
            price: parseFloat(price) || 0,
            compare_price: compare_price ? parseFloat(compare_price) : null,
            cost_price: cost_price ? parseFloat(cost_price) : null,
            stock_quantity: parseInt(stock_quantity) || 0,
            unit: unit || 'piece',
            category_id: category_id || null,
            is_featured: is_featured || false,
            is_active: false, // ✅ Default: pending approval
            weight: weight ? parseFloat(weight) : null,
            weight_unit: weight_unit || 'kg',
            images: images || []
        });

        console.log(`✅ Product created: ${product.id} - ${product.name}`);

        res.status(201).json({
            success: true,
            message: 'Product created successfully, pending approval',
            product
        });

    } catch (error) {
        console.error('❌ Create product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create product',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
};

// ============================================
// GET ALL PRODUCTS (Homepage & Marketplace)
// ============================================
exports.getAllProducts = async (req, res) => {
    try {
        const { limit = 20, offset = 0, category } = req.query;

        const where = { is_active: true };
        if (category) {
            where.category_id = category;
        }

        const products = await Product.findAndCountAll({
            where,
            attributes: [
                'id', 'store_id', 'name', 'slug', 'description',
                'price', 'compare_price', 'cost_price',
                'stock_quantity', 'low_stock_threshold',
                'unit', 'images', 'category_id',
                'is_active', 'is_featured', 'is_digital',
                'weight', 'weight_unit', 'views',
                'sales_count', 'rating',
                'created_at', 'updated_at'
                // ❌ REMOVED: 'status'
            ],
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug', 'icon']
                }
            ],
            limit: parseInt(limit) || 20,
            offset: parseInt(offset) || 0,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            products: products.rows,
            total: products.count
        });

    } catch (error) {
        console.error('❌ Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products',
            details: error.message
        });
    }
};

// ============================================
// GET PRODUCT BY ID
// ============================================
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug', 'icon']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // ✅ Increment views
        await product.increment('views');

        res.json({ 
            success: true,
            product 
        });
    } catch (error) {
        console.error('❌ Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// ============================================
// UPDATE PRODUCT
// ============================================
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // ✅ Check if vendor owns this product
        const store = await Store.findOne({
            where: { user_id: req.user.id }
        });

        if (product.store_id !== store.id) {
            return res.status(403).json({ error: 'Unauthorized to update this product' });
        }

        const updates = req.body;
        await product.update(updates);

        // ✅ Reset to pending if product was approved
        if (updates.is_active === undefined) {
            await product.update({ is_active: false });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        console.error('❌ Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// ============================================
// DELETE PRODUCT
// ============================================
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // ✅ Check if vendor owns this product
        const store = await Store.findOne({
            where: { user_id: req.user.id }
        });

        if (product.store_id !== store.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this product' });
        }

        await product.destroy();

        res.json({ 
            success: true,
            message: 'Product deleted successfully' 
        });

    } catch (error) {
        console.error('❌ Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// ============================================
// GET PRODUCTS BY STORE
// ============================================
exports.getStoreProducts = async (req, res) => {
    try {
        const { storeId } = req.params;
        const products = await Product.findAll({
            where: { store_id: storeId, is_active: true },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug', 'icon']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ 
            success: true,
            products 
        });
    } catch (error) {
        console.error('❌ Get store products error:', error);
        res.status(500).json({ error: 'Failed to fetch store products' });
    }
};

// ============================================
// GET NEARBY PRODUCTS (Location-Based)
// ============================================
exports.getNearbyProducts = async (req, res) => {
    try {
        const { lat, lng, radius = DEFAULT_RADIUS } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ 
                error: 'Latitude and longitude are required',
                example: '/api/products/nearby?lat=-1.2833&lng=36.8167&radius=15'
            });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude values' });
        }

        // ✅ Get all active products with store information
        const products = await Product.findAll({
            where: { is_active: true },
            attributes: [
                'id', 'store_id', 'name', 'slug', 'description',
                'price', 'stock_quantity', 'unit', 'images',
                'category_id', 'is_active', 'is_featured',
                'views', 'sales_count', 'rating',
                'created_at', 'updated_at'
                // ❌ REMOVED: 'status'
            ],
            include: [
                {
                    model: Store,
                    as: 'store',
                    where: {
                        latitude: { [Op.ne]: null },
                        longitude: { [Op.ne]: null }
                    },
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug', 'icon']
                }
            ]
        });

        // ✅ Filter products by distance
        const nearbyProducts = products
            .map(product => {
                const store = product.store;
                if (!store || store.latitude === null || store.longitude === null) {
                    return null;
                }

                const distance = calculateDistance(
                    userLat, userLng,
                    parseFloat(store.latitude),
                    parseFloat(store.longitude)
                );

                return {
                    ...product.toJSON(),
                    distance_km: Math.round(distance * 10) / 10,
                    store: {
                        ...store.toJSON(),
                        distance_km: Math.round(distance * 10) / 10
                    }
                };
            })
            .filter(product => product !== null && product.distance_km <= radius)
            .sort((a, b) => a.distance_km - b.distance_km);

        res.json({
            success: true,
            products: nearbyProducts,
            user_location: { lat: userLat, lng: userLng },
            radius_km: radius,
            count: nearbyProducts.length
        });

    } catch (error) {
        console.error('❌ Get nearby products error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch nearby products',
            details: error.message
        });
    }
};

// ============================================
// GET PRODUCTS BY CAMPUS
// ============================================
exports.getProductsByCampus = async (req, res) => {
    try {
        const { campus, radius = DEFAULT_RADIUS } = req.query;

        if (!campus) {
            return res.status(400).json({ error: 'Campus name is required' });
        }

        // ✅ Try to find campus in database first
        let campusRecord = await Campus.findOne({
            where: { 
                name: { [Op.iLike]: `%${campus}%` }
            }
        });

        if (!campusRecord) {
            return res.status(404).json({ 
                error: 'Campus not found. Please check the campus name.' 
            });
        }

        // ✅ Use campus coordinates from database
        const coords = {
            lat: campusRecord.latitude,
            lng: campusRecord.longitude
        };

        if (!coords.lat || !coords.lng) {
            return res.status(400).json({ 
                error: 'Campus coordinates not set. Please contact admin.' 
            });
        }

        // Reuse the nearby products function
        const reqWithCoords = {
            query: {
                lat: coords.lat,
                lng: coords.lng,
                radius: radius
            }
        };

        return exports.getNearbyProducts(reqWithCoords, res);

    } catch (error) {
        console.error('❌ Get products by campus error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch products by campus',
            details: error.message
        });
    }
};

// ============================================
// GET FEATURED PRODUCTS (For Homepage)
// ============================================
exports.getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const products = await Product.findAll({
            where: { 
                is_active: true,
                is_featured: true
            },
            attributes: [
                'id', 'store_id', 'name', 'slug', 'description',
                'price', 'stock_quantity', 'unit', 'images',
                'category_id', 'is_active', 'is_featured',
                'views', 'sales_count', 'rating',
                'created_at', 'updated_at'
                // ❌ REMOVED: 'status'
            ],
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug', 'icon']
                }
            ],
            limit: parseInt(limit) || 6,
            order: [['sales_count', 'DESC'], ['rating', 'DESC']]
        });

        res.json({
            success: true,
            products
        });

    } catch (error) {
        console.error('❌ Get featured products error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch featured products',
            details: error.message
        });
    }
};