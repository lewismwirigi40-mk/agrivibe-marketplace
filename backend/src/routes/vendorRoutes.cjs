const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

console.log('🔥 VENDOR ROUTES LOADED');
console.log('📊 vendorController.getAnalytics exists?', typeof vendorController.getAnalytics);

// ============================================
// ALL VENDOR ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(authMiddleware);

// ============================================
// ✅ STATIC ROUTES MUST COME FIRST (BEFORE /:id routes)
// ============================================

// ✅ ANALYTICS - WITH DEBUGGING
router.get('/analytics', (req, res, next) => {
    console.log('🎯 /analytics route was hit!');
    next();
}, vendorController.getAnalytics);

// ✅ STATUS - WITH DEBUGGING
router.get('/status', (req, res, next) => {
    console.log('🎯 /status route was hit!');
    next();
}, async (req, res) => {
    try {
        console.log('📡 Vendor status check for user:', req.user.id);
        
        const Store = require('../models/Store.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        return res.json({
            success: true,
            vendor: {
                id: store.id,
                store_name: store.store_name,
                is_approved: store.is_approved,
                is_active: store.is_active,
                created_at: store.created_at,
                status: store.is_approved ? 'approved' : 'pending'
            }
        });

    } catch (error) {
        console.error('❌ Vendor status error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch vendor status'
        });
    }
});

// ✅ PROFILE
router.get('/profile', async (req, res) => {
    try {
        console.log('📡 Vendor profile check for user:', req.user.id);
        
        const Store = require('../models/Store.cjs');
        const store = await Store.findOne({ 
            where: { vendor_id: req.user.id } 
        });
        
        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }
        
        return res.json({
            success: true,
            vendor: store
        });
    } catch (error) {
        console.error('❌ Vendor profile endpoint error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to retrieve vendor profile data'
        });
    }
});

// ✅ STATS
router.get('/stats', async (req, res) => {
    try {
        console.log('📡 Vendor stats for user:', req.user.id);
        
        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');
        const Order = require('../models/Order.cjs');
        const OrderItem = require('../models/OrderItem.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const totalProducts = await Product.count({
            where: { store_id: store.id }
        });

        const orderItems = await OrderItem.findAll({
            where: { vendor_id: store.id },
            attributes: ['order_id'],
            group: ['order_id']
        });
        const totalOrders = orderItems.length;

        const completedItems = await OrderItem.findAll({
            where: { 
                vendor_id: store.id,
                status: 'completed'
            },
            attributes: ['order_id'],
            group: ['order_id']
        });
        const completedOrders = completedItems.length;

        const pendingItems = await OrderItem.findAll({
            where: { 
                vendor_id: store.id,
                status: 'pending'
            },
            attributes: ['order_id'],
            group: ['order_id']
        });
        const pendingOrders = pendingItems.length;

        const completedOrderItems = await OrderItem.findAll({
            where: { 
                vendor_id: store.id,
                status: 'completed'
            }
        });
        const totalRevenue = completedOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const totalSales = completedOrderItems.length;

        const customerIds = new Set();
        const allOrderItems = await OrderItem.findAll({
            where: { vendor_id: store.id },
            include: [{ model: Order, as: 'order' }]
        });
        allOrderItems.forEach(item => {
            if (item.order && item.order.customer_id) {
                customerIds.add(item.order.customer_id);
            }
        });

        return res.json({
            success: true,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCustomers: customerIds.size,
            pendingOrders,
            completedOrders,
            averageRating: store.rating || 0,
            totalSales
        });

    } catch (error) {
        console.error('❌ Vendor stats error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch vendor stats',
            details: error.message
        });
    }
});

// ✅ DASHBOARD
router.get('/dashboard', async (req, res) => {
    try {
        return res.json({
            success: true,
            stats: { totalSales: 0, orderCount: 0, activeProducts: 0, lowStockCount: 0 }
        });
    } catch (error) {
        console.error('❌ Vendor dashboard error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data'
        });
    }
});

// ============================================
// VENDOR ORDERS
// ============================================

router.get('/orders', async (req, res) => {
    try {
        console.log('📡 Vendor orders for user:', req.user.id);
        
        const Store = require('../models/Store.cjs');
        const OrderItem = require('../models/OrderItem.cjs');
        const Order = require('../models/Order.cjs');
        const User = require('../models/User.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const { limit = 20, offset = 0 } = req.query;

        const orderItems = await OrderItem.findAndCountAll({
            where: { vendor_id: store.id },
            include: [
                { 
                    model: Order, 
                    as: 'order',
                    include: [
                        { model: User, as: 'customer', attributes: ['id', 'first_name', 'last_name', 'email'] }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        const formattedOrders = orderItems.rows.map(item => ({
            id: item.order?.id || item.id,
            total_amount: item.order?.total_amount || item.price * item.quantity,
            status: item.order?.status || item.status,
            created_at: item.order?.created_at || item.created_at,
            user: item.order?.customer || null,
            items: [{
                id: item.id,
                name: item.product_name || 'Product',
                quantity: item.quantity,
                price: item.price
            }]
        }));

        return res.json({
            success: true,
            total: orderItems.count,
            orders: formattedOrders
        });

    } catch (error) {
        console.error('❌ Vendor orders error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch vendor orders'
        });
    }
});

// ============================================
// VENDOR NOTIFICATIONS
// ============================================

router.get('/notifications', async (req, res) => {
    try {
        console.log('📡 Vendor notifications for user:', req.user.id);
        
        return res.json({
            success: true,
            notifications: [],
            unread: 0
        });

    } catch (error) {
        console.error('❌ Vendor notifications error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
});

// ============================================
// VENDOR PRODUCT MANAGEMENT
// ============================================

router.post('/products', async (req, res) => {
    try {
        console.log('📝 Creating new product for vendor:', req.user.id);
        console.log('📦 Product data:', req.body);

        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');
        const Category = require('../models/Category.cjs');

        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor. Please complete your store setup first.'
            });
        }

        const {
            name,
            price,
            stock_quantity,
            unit,
            category,
            description,
            min_order = 1,
            weight,
            origin,
            harvest_date,
            is_organic = false,
            is_seasonal = false,
            images = []
        } = req.body;

        if (!name || !price || !stock_quantity || !unit || !category) {
            return res.status(400).json({
                success: false,
                error: 'Name, price, stock quantity, unit, and category are required'
            });
        }

        let categoryRecord = await Category.findOne({
            where: { 
                name: { [Op.iLike]: category }
            }
        });

        if (!categoryRecord) {
            categoryRecord = await Category.create({
                name: category,
                slug: category.toLowerCase().replace(/\s+/g, '-'),
                is_active: true
            });
            console.log(`📂 Created new category: ${category}`);
        }

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            + '-' + Date.now().toString(36);

        console.log('🔗 Generated slug:', slug);

        const product = await Product.create({
            store_id: store.id,
            name,
            slug,
            price: parseFloat(price),
            stock_quantity: parseInt(stock_quantity),
            unit,
            category_id: categoryRecord.id,
            description: description || '',
            min_order: parseInt(min_order) || 1,
            weight: weight ? parseFloat(weight) : null,
            origin: origin || null,
            harvest_date: harvest_date || null,
            is_organic: is_organic || false,
            is_seasonal: is_seasonal || false,
            images: images || [],
            is_active: false,
            views: 0,
            sales_count: 0,
            rating: 0
        });

        console.log(`✅ Product created successfully: ${product.id} - ${product.name}`);

        return res.status(201).json({
            success: true,
            message: 'Product submitted for approval successfully!',
            product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                stock_quantity: product.stock_quantity,
                unit: product.unit,
                category_id: product.category_id,
                status: product.status,
                is_approved: product.is_approved,
                created_at: product.created_at
            }
        });

    } catch (error) {
        console.error('❌ Error creating product:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create product',
            details: error.message
        });
    }
});

router.get('/products', async (req, res) => {
    try {
        console.log('📡 Vendor products for user:', req.user.id);
        
        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');
        const Category = require('../models/Category.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const { limit = 20, offset = 0 } = req.query;

        const products = await Product.findAndCountAll({
            where: { store_id: store.id },
            attributes: ['id', 'name', 'slug', 'price', 'stock_quantity', 'unit', 'category_id', 'is_active', 'images', 'created_at'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        const formattedProducts = products.rows.map(product => ({
            ...product.toJSON ? product.toJSON() : product,
            status: product.is_active ? 'approved' : 'pending',
            is_approved: product.is_active
        }));

        return res.json({
            success: true,
            total: products.count,
            products: formattedProducts
        });

    } catch (error) {
        console.error('❌ Vendor products error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch vendor products',
            details: error.message
        });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        console.log('📡 Get product by ID:', req.params.id);
        
        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const product = await Product.findOne({
            where: {
                id: req.params.id,
                store_id: store.id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        return res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        console.log('📝 Updating product:', req.params.id);
        
        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');
        const Category = require('../models/Category.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const product = await Product.findOne({
            where: {
                id: req.params.id,
                store_id: store.id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        const {
            name,
            price,
            stock_quantity,
            unit,
            category,
            description,
            min_order,
            weight,
            origin,
            harvest_date,
            is_organic,
            is_seasonal,
            images
        } = req.body;

        let category_id = product.category_id;
        if (category) {
            let categoryRecord = await Category.findOne({
                where: { 
                    name: { [Op.iLike]: category }
                }
            });
            
            if (!categoryRecord) {
                categoryRecord = await Category.create({
                    name: category,
                    slug: category.toLowerCase().replace(/\s+/g, '-'),
                    is_active: true
                });
            }
            category_id = categoryRecord.id;
        }

        await product.update({
            name: name || product.name,
            price: price ? parseFloat(price) : product.price,
            stock_quantity: stock_quantity ? parseInt(stock_quantity) : product.stock_quantity,
            unit: unit || product.unit,
            category_id: category_id,
            description: description !== undefined ? description : product.description,
            min_order: min_order ? parseInt(min_order) : product.min_order,
            weight: weight !== undefined ? parseFloat(weight) : product.weight,
            origin: origin !== undefined ? origin : product.origin,
            harvest_date: harvest_date || product.harvest_date,
            is_organic: is_organic !== undefined ? is_organic : product.is_organic,
            is_seasonal: is_seasonal !== undefined ? is_seasonal : product.is_seasonal,
            images: images || product.images,
            status: product.status === 'approved' ? 'pending' : product.status,
            is_approved: false
        });

        console.log(`✅ Product updated successfully: ${product.id}`);

        return res.json({
            success: true,
            message: 'Product updated successfully. Changes require re-approval.',
            product
        });

    } catch (error) {
        console.error('❌ Error updating product:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        console.log('🗑️ Deleting product:', req.params.id);
        
        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');
        
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const product = await Product.findOne({
            where: {
                id: req.params.id,
                store_id: store.id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        await product.destroy();

        console.log(`✅ Product deleted successfully: ${req.params.id}`);

        return res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting product:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});

// ============================================
// VENDOR PRODUCT IMAGES
// ============================================

router.post('/products/:id/images', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📸 Uploading images for product: ${id}`);

        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');

        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const product = await Product.findOne({
            where: {
                id: id,
                store_id: store.id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        if (!req.files || !req.files.images) {
            return res.status(400).json({
                success: false,
                error: 'No image files uploaded'
            });
        }

        const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const uploadedUrls = [];

        for (const imageFile of imageFiles) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(imageFile.mimetype)) {
                continue;
            }

            if (imageFile.size > 5 * 1024 * 1024) {
                continue;
            }

            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const filename = `product-${product.id}-${timestamp}-${random}.${imageFile.name.split('.').pop()}`;
            const uploadPath = path.join(__dirname, '../../storage/uploads/products', filename);

            if (!fs.existsSync(path.join(__dirname, '../../storage/uploads/products'))) {
                fs.mkdirSync(path.join(__dirname, '../../storage/uploads/products'), { recursive: true });
            }

            await imageFile.mv(uploadPath);
            const imageUrl = `/uploads/products/${filename}`;
            uploadedUrls.push(imageUrl);
        }

        if (uploadedUrls.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid images uploaded. Please upload JPEG, PNG, GIF, or WEBP files under 5MB.'
            });
        }

        const currentImages = product.images || [];
        const updatedImages = [...currentImages, ...uploadedUrls];
        await product.update({ images: updatedImages });

        console.log(`✅ ${uploadedUrls.length} images uploaded successfully for product ${id}`);

        return res.json({
            success: true,
            message: `${uploadedUrls.length} images uploaded successfully`,
            images: uploadedUrls
        });

    } catch (error) {
        console.error('❌ Image upload error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to upload images',
            details: error.message
        });
    }
});

router.post('/products/:id/image', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📸 Uploading image for product: ${id}`);

        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');

        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const product = await Product.findOne({
            where: {
                id: id,
                store_id: store.id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                error: 'No image file uploaded'
            });
        }

        const imageFile = req.files.image;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(imageFile.mimetype)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WEBP.'
            });
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 5MB.'
            });
        }

        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `product-${product.id}-${timestamp}-${random}.${imageFile.name.split('.').pop()}`;
        const uploadPath = path.join(__dirname, '../../storage/uploads/products', filename);

        if (!fs.existsSync(path.join(__dirname, '../../storage/uploads/products'))) {
            fs.mkdirSync(path.join(__dirname, '../../storage/uploads/products'), { recursive: true });
        }

        await imageFile.mv(uploadPath);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${filename}`;

        const currentImages = product.images || [];
        currentImages.push(imageUrl);
        await product.update({ images: currentImages });

        console.log(`✅ Image uploaded successfully for product ${id}`);

        return res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error('❌ Image upload error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to upload image',
            details: error.message
        });
    }
});

router.delete('/products/:id/image', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        console.log(`🗑️ Deleting image from product: ${id}`);

        const Store = require('../models/Store.cjs');
        const Product = require('../models/Product.cjs');

        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'No store found for this vendor'
            });
        }

        const product = await Product.findOne({
            where: {
                id: id,
                store_id: store.id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        const currentImages = product.images || [];
        const updatedImages = currentImages.filter(img => img !== imageUrl);
        await product.update({ images: updatedImages });

        const filename = imageUrl.split('/').pop();
        const filePath = path.join(__dirname, '../../storage/uploads/products', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ File deleted: ${filePath}`);
        }

        console.log(`✅ Image deleted successfully from product ${id}`);

        return res.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('❌ Image deletion error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete image',
            details: error.message
        });
    }
});

module.exports = router;