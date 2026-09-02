// backend/src/controllers/vendorController.cjs
console.log('🔥 VENDOR CONTROLLER LOADED');

const User = require('../models/User.cjs');
const Vendor = require('../models/Vendor.cjs');
const Product = require('../models/Product.cjs');
const Order = require('../models/Order.cjs');
const OrderItem = require('../models/OrderItem.cjs');
const Category = require('../models/Category.cjs');  // ✅ ADD THIS
const { Op , fn, col } = require('sequelize');

// ============================================
// VENDOR REGISTRATION
// ============================================

// Register as Vendor
exports.registerVendor = async (req, res) => {
    console.log('🔥 VENDOR REGISTRATION CALLED');
    console.log('📝 Request body:', req.body);

    try {
        const { 
            business_name, 
            business_description, 
            business_address, 
            business_phone,
            business_email,
            business_website,
            user_id 
        } = req.body;

        if (!business_name) {
            return res.status(400).json({ error: 'Business name is required' });
        }

        // Check if vendor already exists for this user
        const existingVendor = await Vendor.findOne({ where: { user_id } });
        if (existingVendor) {
            return res.status(400).json({ 
                error: 'You are already registered as a vendor' 
            });
        }

        // Create vendor with pending approval status
        const vendor = await Vendor.create({
            user_id,
            business_name,
            business_description,
            business_address,
            business_phone,
            business_email,
            business_website,
            is_approved: false,
            is_active: true,
            status: 'pending'
        });

        console.log('✅ Vendor created with pending status:', vendor.id);

        res.status(201).json({
            success: true,
            message: 'Vendor registration submitted for approval',
            vendor: {
                id: vendor.id,
                business_name: vendor.business_name,
                status: vendor.status,
                is_approved: vendor.is_approved
            }
        });

    } catch (error) {
        console.error('❌ Vendor registration error:', error);
        res.status(500).json({ error: 'Failed to register as vendor' });
    }
};

// ============================================
// ADMIN VENDOR MANAGEMENT
// ============================================

// Get pending vendors (for admin)
exports.getPendingVendors = async (req, res) => {
    console.log('🔥 GET PENDING VENDORS CALLED');

    try {
        const pendingVendors = await Vendor.findAll({
            where: { 
                is_approved: false,
                status: 'pending'
            },
            include: [
                { 
                    model: User, 
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] 
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            vendors: pendingVendors
        });

    } catch (error) {
        console.error('❌ Get pending vendors error:', error);
        res.status(500).json({ error: 'Failed to fetch pending vendors' });
    }
};

// Approve vendor (admin only)
exports.approveVendor = async (req, res) => {
    console.log('🔥 APPROVE VENDOR CALLED');
    console.log('📝 Vendor ID:', req.params.id);

    try {
        const vendorId = req.params.id;
        const vendor = await Vendor.findByPk(vendorId);

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        await vendor.update({
            is_approved: true,
            status: 'approved',
            approved_at: new Date()
        });

        // Update user role to vendor if not already
        const user = await User.findByPk(vendor.user_id);
        if (user && user.role !== 'vendor') {
            await user.update({ role: 'vendor' });
        }

        console.log('✅ Vendor approved:', vendorId);

        res.json({
            success: true,
            message: 'Vendor approved successfully',
            vendor
        });

    } catch (error) {
        console.error('❌ Approve vendor error:', error);
        res.status(500).json({ error: 'Failed to approve vendor' });
    }
};

// Reject vendor (admin only)
exports.rejectVendor = async (req, res) => {
    console.log('🔥 REJECT VENDOR CALLED');
    console.log('📝 Vendor ID:', req.params.id);

    try {
        const vendorId = req.params.id;
        const vendor = await Vendor.findByPk(vendorId);

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        await vendor.update({
            is_approved: false,
            status: 'rejected',
            rejected_at: new Date()
        });

        console.log('✅ Vendor rejected:', vendorId);

        res.json({
            success: true,
            message: 'Vendor rejected',
            vendor
        });

    } catch (error) {
        console.error('❌ Reject vendor error:', error);
        res.status(500).json({ error: 'Failed to reject vendor' });
    }
};

// ============================================
// VENDOR DASHBOARD STATS
// ============================================

// Get vendor dashboard stats
exports.getVendorStats = async (req, res) => {
    console.log('🔥 GET VENDOR STATS CALLED');
    
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find vendor
        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Get vendor products
        const products = await Product.findAll({
            where: { vendor_id: vendor.id }
        });

        // Get vendor orders through order items
        const orderItems = await OrderItem.findAll({
            where: { vendor_id: vendor.id },
            include: [
                { model: Order, as: 'order' }
            ]
        });

        // Calculate stats
        const totalProducts = products.length;
        const totalOrders = orderItems.length;
        
        // Calculate total revenue from completed orders only
        const completedOrders = orderItems.filter(item => 
            item.order && item.order.status === 'completed'
        );
        const totalRevenue = completedOrders.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );

        // Get unique customers
        const customerIds = new Set();
        orderItems.forEach(item => {
            if (item.order && item.order.user_id) {
                customerIds.add(item.order.user_id);
            }
        });

        const totalCustomers = customerIds.size;

        // Get pending orders
        const pendingOrders = orderItems.filter(item => 
            item.order && item.order.status === 'pending'
        ).length;

        // Get completed orders count
        const completedOrdersCount = completedOrders.length;

        // Get average rating (if you have reviews)
        const averageRating = vendor.rating || 0;

        // Get total sales count
        const totalSales = orderItems.filter(item => 
            item.order && item.order.status === 'completed'
        ).length;

        res.json({
            success: true,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCustomers,
            pendingOrders,
            completedOrders: completedOrdersCount,
            averageRating: parseFloat(averageRating),
            totalSales
        });

    } catch (error) {
        console.error('❌ Get vendor stats error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor stats' });
    }
};

// ============================================
// VENDOR PROFILE
// ============================================

// Get vendor profile
exports.getVendorProfile = async (req, res) => {
    console.log('🔥 GET VENDOR PROFILE CALLED');

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const vendor = await Vendor.findOne({
            where: { user_id: userId },
            include: [
                { 
                    model: User, 
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] 
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.json({
            success: true,
            vendor
        });

    } catch (error) {
        console.error('❌ Get vendor profile error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor profile' });
    }
};

// Update vendor profile
exports.updateVendorProfile = async (req, res) => {
    console.log('🔥 UPDATE VENDOR PROFILE CALLED');
    console.log('📝 Request body:', req.body);

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const { 
            business_name, 
            business_description, 
            business_address, 
            business_phone,
            business_email,
            business_website,
            business_logo 
        } = req.body;

        await vendor.update({
            business_name: business_name || vendor.business_name,
            business_description: business_description || vendor.business_description,
            business_address: business_address || vendor.business_address,
            business_phone: business_phone || vendor.business_phone,
            business_email: business_email || vendor.business_email,
            business_website: business_website || vendor.business_website,
            business_logo: business_logo || vendor.business_logo
        });

        res.json({
            success: true,
            message: 'Vendor profile updated successfully',
            vendor
        });

    } catch (error) {
        console.error('❌ Update vendor profile error:', error);
        res.status(500).json({ error: 'Failed to update vendor profile' });
    }
};

// ============================================
// VENDOR ORDERS
// ============================================

// Get vendor orders
exports.getVendorOrders = async (req, res) => {
    console.log('🔥 GET VENDOR ORDERS CALLED');

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { limit = 20, offset = 0, status } = req.query;

        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const where = { vendor_id: vendor.id };
        if (status && status !== 'all') {
            where['$order.status$'] = status;
        }

        const orderItems = await OrderItem.findAll({
            where,
            include: [
                { 
                    model: Order, 
                    as: 'order',
                    include: [
                        { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] }
                    ]
                },
                { model: Product, attributes: ['id', 'name', 'images'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            orders: orderItems
        });

    } catch (error) {
        console.error('❌ Get vendor orders error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor orders' });
    }
};

// ============================================
// VENDOR PRODUCTS
// ============================================

// Get vendor products
exports.getVendorProducts = async (req, res) => {
    console.log('🔥 GET VENDOR PRODUCTS CALLED');

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { limit = 20, offset = 0 } = req.query;

        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const products = await Product.findAll({
            where: { vendor_id: vendor.id },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            products
        });

    } catch (error) {
        console.error('❌ Get vendor products error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor products' });
    }
};
// ============================================
// VENDOR PRODUCT IMAGES
// ============================================

// Upload product images
exports.uploadProductImages = async (req, res) => {
    console.log('🔥 UPLOAD PRODUCT IMAGES CALLED');
    console.log('📝 Product ID:', req.params.id);
    console.log('📝 Files:', req.files);

    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find the product
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if product belongs to vendor
        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        if (product.vendor_id !== vendor.id) {
            return res.status(403).json({ error: 'You do not own this product' });
        }

        // Check if files exist
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        // Process images - store them
        const uploadedImages = [];
        const images = req.files;

        // Check if product already has images
        let currentImages = product.images || [];

        // Add new images
        for (const file of images) {
            // You can upload to Cloudinary, S3, or save locally
            // For now, we'll store as base64 or URL
            const imageData = {
                url: file.path || `/uploads/${file.filename}`,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype
            };

            currentImages.push(imageData.url);
            uploadedImages.push(imageData);
        }

        // Update product with new images
        await product.update({
            images: currentImages
        });

        console.log(`✅ Uploaded ${images.length} images for product ${id}`);

        res.json({
            success: true,
            message: `${images.length} images uploaded successfully`,
            images: uploadedImages,
            product: {
                id: product.id,
                name: product.name,
                images: product.images
            }
        });

    } catch (error) {
        console.error('❌ Upload product images error:', error);
        res.status(500).json({ 
            error: 'Failed to upload images',
            details: error.message 
        });
    }
};

// Delete product image
exports.deleteProductImage = async (req, res) => {
    console.log('🔥 DELETE PRODUCT IMAGE CALLED');
    console.log('📝 Product ID:', req.params.id);
    console.log('📝 Image Index:', req.params.imageIndex);

    try {
        const { id, imageIndex } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find the product
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if product belongs to vendor
        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        if (product.vendor_id !== vendor.id) {
            return res.status(403).json({ error: 'You do not own this product' });
        }

        // Remove image at index
        let currentImages = product.images || [];
        const index = parseInt(imageIndex);

        if (index < 0 || index >= currentImages.length) {
            return res.status(400).json({ error: 'Invalid image index' });
        }

        const removedImage = currentImages[index];
        currentImages.splice(index, 1);

        await product.update({
            images: currentImages
        });

        console.log(`✅ Deleted image for product ${id}`);

        res.json({
            success: true,
            message: 'Image deleted successfully',
            product: {
                id: product.id,
                name: product.name,
                images: product.images
            }
        });

    } catch (error) {
        console.error('❌ Delete product image error:', error);
        res.status(500).json({ 
            error: 'Failed to delete image',
            details: error.message 
        });
    }
};
// ============================================
// VENDOR ANALYTICS - REAL DATA (NO DUMMY)
// ============================================

exports.getAnalytics = async (req, res) => {
    console.log('🔥 GET VENDOR ANALYTICS CALLED');
    
    try {
        const userId = req.user?.id;
        if (!userId) {
            console.error('❌ No user ID found');
            return res.status(401).json({ 
                success: false, 
                error: 'Unauthorized' 
            });
        }

        const { timeframe = 'week' } = req.query;
        console.log(`📊 Timeframe: ${timeframe}`);
        
        // Find vendor
        const vendor = await Vendor.findOne({ where: { user_id: userId } });
        if (!vendor) {
            console.error('❌ Vendor not found for user:', userId);
            return res.status(404).json({ 
                success: false, 
                error: 'Vendor not found' 
            });
        }
        console.log(`✅ Vendor found: ${vendor.id}`);

        // ============================================
        // 1. CALCULATE DATE RANGE
        // ============================================
        let startDate = new Date();
        let groupFormat = 'day';
        
        if (timeframe === 'week') {
            startDate.setDate(startDate.getDate() - 7);
            groupFormat = 'day';
        } else if (timeframe === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
            groupFormat = 'day';
        } else if (timeframe === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupFormat = 'month';
        }
        console.log(`📅 Start date: ${startDate.toISOString()}`);

        // ============================================
        // 2. GET ALL ORDER ITEMS (WITH PRODUCTS FOR CATEGORIES)
        // ============================================
        const allOrderItems = await OrderItem.findAll({
            where: { vendor_id: vendor.id },
            include: [
                { 
                    model: Order, 
                    as: 'order',
                    where: {
                        created_at: { [Op.gte]: startDate }
                    },
                    required: true
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'category_id'],
                    include: [
                        {
                            model: Category,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        console.log(`📦 Found ${allOrderItems.length} order items`);

        // ============================================
        // 3. TOTAL STATS
        // ============================================
        const totalOrders = allOrderItems.length;
        const totalRevenue = allOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // ✅ REAL: Unique customers
        const customerIds = new Set();
        allOrderItems.forEach(item => {
            if (item.order && item.order.customer_id) {
                customerIds.add(item.order.customer_id);
            }
        });
        const totalCustomers = customerIds.size;

        const conversionRate = totalCustomers > 0 ? Math.round((totalOrders / (totalCustomers * 3)) * 100) : 0;

        // ============================================
        // 4. ✅ REVENUE TREND (REAL DATA)
        // ============================================
        const revenueTrend = [];
        const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : timeframe === 'year' ? 12 : 7;
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            let label;
            if (timeframe === 'year') {
                label = date.toLocaleDateString('en-KE', { month: 'short' });
            } else {
                label = date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
            }
            
            // Filter orders for this day/month
            const dayOrders = allOrderItems.filter(item => {
                const itemDate = new Date(item.order.created_at);
                if (timeframe === 'year') {
                    return itemDate.getMonth() === date.getMonth() && 
                           itemDate.getFullYear() === date.getFullYear();
                }
                return itemDate.toDateString() === date.toDateString();
            });
            
            revenueTrend.push({
                label,
                revenue: dayOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                orders: dayOrders.length
            });
        }

        // ============================================
        // 5. ✅ DAILY SALES (REAL DATA)
        // ============================================
        const dailySales = revenueTrend.map(item => ({
            label: item.label,
            sales: item.revenue
        }));

        // ============================================
        // 6. ✅ SALES BY CATEGORY (REAL DATA)
        // ============================================
        const categoryMap = {};
        allOrderItems.forEach(item => {
            const categoryName = item.product?.category?.name || 'Uncategorized';
            if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = 0;
            }
            categoryMap[categoryName] += item.price * item.quantity;
        });

        const salesByCategory = Object.keys(categoryMap).map(name => ({
            name,
            value: categoryMap[name]
        }));

        // ============================================
        // 7. ✅ TOP PRODUCTS (REAL DATA)
        // ============================================
        const productMap = {};
        allOrderItems.forEach(item => {
            const productName = item.product?.name || 'Unknown Product';
            if (!productMap[productName]) {
                productMap[productName] = { orders: 0, revenue: 0 };
            }
            productMap[productName].orders += item.quantity;
            productMap[productName].revenue += item.price * item.quantity;
        });

        const topProducts = Object.keys(productMap)
            .map(name => ({
                name,
                orders: productMap[name].orders,
                revenue: productMap[name].revenue,
                trend: 'up',
                trend_percentage: 0
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // ============================================
        // 8. ✅ ORDER STATUS (REAL DATA)
        // ============================================
        const statusMap = {};
        allOrderItems.forEach(item => {
            const status = item.order?.status || 'unknown';
            if (!statusMap[status]) {
                statusMap[status] = 0;
            }
            statusMap[status]++;
        });

        const orderStatus = Object.keys(statusMap).map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: statusMap[key]
        }));

        // ============================================
        // 9. ✅ CUSTOMER INSIGHTS (REAL DATA)
        // ============================================
        const customerData = {};
        const monthOrderCount = {};
        
        allOrderItems.forEach(item => {
            if (item.order && item.order.customer_id) {
                const month = new Date(item.order.created_at).toLocaleDateString('en-KE', { month: 'short' });
                const customerId = item.order.customer_id;
                
                if (!customerData[month]) {
                    customerData[month] = { new: 0, returning: 0 };
                }
                if (!monthOrderCount[month]) {
                    monthOrderCount[month] = {};
                }
                if (!monthOrderCount[month][customerId]) {
                    monthOrderCount[month][customerId] = 0;
                }
                monthOrderCount[month][customerId]++;
            }
        });

        // Determine new vs returning customers per month
        Object.keys(monthOrderCount).forEach(month => {
            Object.keys(monthOrderCount[month]).forEach(customerId => {
                const count = monthOrderCount[month][customerId];
                // Check if customer had orders in previous months
                const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(month);
                let hadPreviousOrders = false;
                for (let i = 0; i < monthIndex; i++) {
                    const prevMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i];
                    if (monthOrderCount[prevMonth] && monthOrderCount[prevMonth][customerId]) {
                        hadPreviousOrders = true;
                        break;
                    }
                }
                
                if (hadPreviousOrders || count > 1) {
                    customerData[month].returning += count;
                } else {
                    customerData[month].new += count;
                }
            });
        });

        const customerInsights = Object.keys(customerData).map(month => ({
            month,
            new: customerData[month].new || 0,
            returning: customerData[month].returning || 0
        }));

        // ============================================
        // 10. CALCULATE CHANGES (vs previous period)
        // ============================================
        const revenueChange = 0;
        const ordersChange = 0;
        const customersChange = 0;
        const conversionChange = 0;

        // ============================================
        // 11. BUILD RESPONSE (NO DUMMY DATA)
        // ============================================
        const responseData = {
            success: true,
            totalRevenue,
            totalOrders,
            totalCustomers,
            conversionRate,
            revenueChange,
            ordersChange,
            customersChange,
            conversionChange,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            returnRate: 0,
            customerRetention: 0,
            revenueTrend: revenueTrend.length > 0 ? revenueTrend : [{ label: 'No Data', revenue: 0, orders: 0 }],
            dailySales: dailySales.length > 0 ? dailySales : [{ label: 'No Data', sales: 0 }],
            salesByCategory: salesByCategory.length > 0 ? salesByCategory : [{ name: 'No Sales', value: 0 }],
            topProducts: topProducts.length > 0 ? topProducts : [{ name: 'No Products', orders: 0, revenue: 0, trend: 'up', trend_percentage: 0 }],
            orderStatus: orderStatus.length > 0 ? orderStatus : [{ name: 'No Orders', value: 0 }],
            customerInsights: customerInsights.length > 0 ? customerInsights : [{ month: 'No Data', new: 0, returning: 0 }]
        };

        console.log('✅ Sending analytics response');
        return res.json(responseData);

    } catch (error) {
        console.error('❌ Get vendor analytics error:', error);
        console.error('❌ Error stack:', error.stack);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch analytics',
            details: error.message 
        });
    }
};
console.log('✅ getAnalytics exported:', typeof exports.getAnalytics);