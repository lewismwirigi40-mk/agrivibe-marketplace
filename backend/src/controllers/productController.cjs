// backend/controllers/productController.cjs
const Product = require('../models/Product.cjs');
const Store = require('../models/Store.cjs');
const { v4: uuidv4 } = require('uuid');
const { calculateDistance } = require('../services/mapsService.cjs');

const DEFAULT_RADIUS = 15; // 15km radius for nearby products

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
// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_active: true },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                }
            ],
            order: [['created_at', 'DESC']] // ⚠️ Double-check if your DB column is 'created_at' or 'createdAt'
        });

        return res.json({ products: products || [] });
    } catch (error) {
        console.error('❌ Get products database error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch products', 
            details: error.message // Exposes the column mismatch to Axios
        });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                }
            ]
        });

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
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ products });
    } catch (error) {
        console.error('Get store products error:', error);
        res.status(500).json({ error: 'Failed to fetch store products' });
    }
};

// ============================================
// ✅ NEW: Get Nearby Products (Location-Based)
// ============================================
exports.getNearbyProducts = async (req, res) => {
    try {
        const { lat, lng, radius = DEFAULT_RADIUS } = req.query;

        // Validate required parameters
        if (!lat || !lng) {
            return res.status(400).json({ 
                error: 'Latitude and longitude are required',
                example: '/api/products/nearby?lat=-1.2833&lng=36.8167&radius=15'
            });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        // Validate coordinates
        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude values' });
        }

        // Get all products with store information
        const products = await Product.findAll({
            where: { is_active: true },
            include: [
                {
                    model: Store,
                    as: 'store',
                    where: {
                        latitude: { [Op.ne]: null },
                        longitude: { [Op.ne]: null }
                    },
                    attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
                }
            ]
        });

        // Filter products by distance
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
                    distance_km: Math.round(distance * 10) / 10, // Round to 1 decimal
                    store: {
                        ...store.toJSON(),
                        distance_km: Math.round(distance * 10) / 10
                    }
                };
            })
            .filter(product => product !== null && product.distance_km <= radius)
            .sort((a, b) => a.distance_km - b.distance_km);

        res.json({
            products: nearbyProducts,
            user_location: { lat: userLat, lng: userLng },
            radius_km: radius,
            count: nearbyProducts.length
        });

    } catch (error) {
        console.error('Get nearby products error:', error);
        res.status(500).json({ error: 'Failed to fetch nearby products' });
    }
};

// ============================================
// ✅ NEW: Get Products Within a Specific Campus
// ============================================
exports.getProductsByCampus = async (req, res) => {
    try {
        const { campus, radius = DEFAULT_RADIUS } = req.query;

        if (!campus) {
            return res.status(400).json({ error: 'Campus name is required' });
        }

        // Campus coordinates mapping
        const campusCoords = {
            'DeKUT': { lat: -0.4201, lng: 36.9479 },
            'JKUAT': { lat: -1.0167, lng: 37.1833 },
            'KU': { lat: -1.1833, lng: 36.9167 },
            'UON': { lat: -1.2833, lng: 36.8167 },
            'MMUST': { lat: 0.2869, lng: 34.7522 },
            'TUK': { lat: -1.2921, lng: 36.8219 },
            'Kenyatta University': { lat: -1.1833, lng: 36.9167 },
            'Moi University': { lat: 0.2869, lng: 35.2769 },
        };

        const coords = campusCoords[campus];
        if (!coords) {
            return res.status(400).json({ error: 'Campus not found' });
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
        console.error('Get products by campus error:', error);
        res.status(500).json({ error: 'Failed to fetch products by campus' });
    }
};