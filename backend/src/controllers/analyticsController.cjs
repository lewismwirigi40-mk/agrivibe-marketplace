const { Op } = require('sequelize');
const Order = require('../models/Order.cjs');
const Product = require('../models/Product.cjs');
const Store = require('../models/Store.cjs');
const User = require('../models/User.cjs');
const Delivery = require('../models/Delivery.cjs');

// ============================================
// ADMIN DASHBOARD STATS
// ============================================

// Get Dashboard Stats (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.count();
        const totalProducts = await Product.count();
        const totalStores = await Store.count();
        const totalCustomers = await User.count({ where: { role: 'customer' } });
        const totalVendors = await User.count({ where: { role: 'vendor' } });
        const totalDrivers = await User.count({ where: { role: 'driver' } });

        // Revenue stats
        const revenueResult = await Order.sum('total', { where: { payment_status: 'paid' } });
        const totalRevenue = revenueResult || 0;

        // Orders by status
        const pendingOrders = await Order.count({ where: { status: 'pending' } });
        const processingOrders = await Order.count({ where: { status: 'processing' } });
        const deliveredOrders = await Order.count({ where: { status: 'delivered' } });
        const cancelledOrders = await Order.count({ where: { status: 'cancelled' } });

        res.json({
            stats: {
                total_orders: totalOrders,
                total_products: totalProducts,
                total_stores: totalStores,
                total_customers: totalCustomers,
                total_vendors: totalVendors,
                total_drivers: totalDrivers,
                total_revenue: totalRevenue,
                orders: {
                    pending: pendingOrders,
                    processing: processingOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders
                }
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

// Get Revenue Analytics
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        let groupFormat;
        switch(period) {
            case 'day': groupFormat = 'YYYY-MM-DD'; break;
            case 'month': groupFormat = 'YYYY-MM'; break;
            case 'year': groupFormat = 'YYYY'; break;
            default: groupFormat = 'YYYY-MM';
        }

        const revenueData = await Order.findAll({
            where: { 
                payment_status: 'paid',
                status: 'delivered'
            },
            attributes: [
                [require('sequelize').fn('DATE_TRUNC', period, require('sequelize').col('created_at')), 'period'],
                [require('sequelize').fn('SUM', require('sequelize').col('total')), 'revenue'],
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orders']
            ],
            group: ['period'],
            order: [['period', 'ASC']],
            raw: true
        });

        res.json({ revenue: revenueData });
    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue analytics' });
    }
};

// Get Revenue by Period
exports.getRevenueByPeriod = async (req, res) => {
    try {
        const { period = 'month', startDate, endDate } = req.query;

        let whereClause = { payment_status: 'paid' };
        if (startDate && endDate) {
            whereClause.created_at = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const revenueData = await Order.findAll({
            where: whereClause,
            attributes: [
                [require('sequelize').fn('DATE_TRUNC', period, require('sequelize').col('created_at')), 'period'],
                [require('sequelize').fn('SUM', require('sequelize').col('total')), 'revenue']
            ],
            group: ['period'],
            order: [['period', 'ASC']],
            raw: true
        });

        res.json({ revenue: revenueData });
    } catch (error) {
        console.error('Revenue by period error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue by period' });
    }
};

// Get Daily Stats
exports.getDailyStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayOrders = await Order.count({
            where: {
                created_at: { [Op.between]: [today, tomorrow] }
            }
        });

        const todayRevenue = await Order.sum('total', {
            where: {
                created_at: { [Op.between]: [today, tomorrow] },
                payment_status: 'paid'
            }
        });

        const todayCustomers = await User.count({
            where: {
                role: 'customer',
                created_at: { [Op.between]: [today, tomorrow] }
            }
        });

        res.json({
            stats: {
                date: today.toISOString().split('T')[0],
                orders: todayOrders,
                revenue: todayRevenue || 0,
                new_customers: todayCustomers
            }
        });

    } catch (error) {
        console.error('Daily stats error:', error);
        res.status(500).json({ error: 'Failed to fetch daily stats' });
    }
};

// Get Order Status Distribution
exports.getOrderStatusDistribution = async (req, res) => {
    try {
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const distribution = {};

        for (const status of statuses) {
            const count = await Order.count({ where: { status } });
            distribution[status] = count;
        }

        res.json({ distribution });
    } catch (error) {
        console.error('Order distribution error:', error);
        res.status(500).json({ error: 'Failed to fetch order distribution' });
    }
};

// ============================================
// TOP PERFORMERS
// ============================================

// Get Top Products
exports.getTopProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const products = await Product.findAll({
            where: { is_active: true },
            order: [['sales_count', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({ top_products: products });
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ error: 'Failed to fetch top products' });
    }
};

// Get Product Performance
exports.getProductPerformance = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const products = await Product.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'price', 'sales_count', 'stock_quantity', 'rating'],
            order: [['sales_count', 'DESC']],
            limit: parseInt(limit)
        });

        const productPerformance = await Promise.all(products.map(async (product) => {
            const revenue = product.price * product.sales_count;
            return {
                ...product.toJSON(),
                revenue: revenue
            };
        }));

        res.json({ products: productPerformance });
    } catch (error) {
        console.error('Product performance error:', error);
        res.status(500).json({ error: 'Failed to fetch product performance' });
    }
};

// Get Top Vendors
exports.getTopVendors = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const topVendors = await Store.findAll({
            where: { is_active: true },
            order: [['total_orders', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({ top_vendors: topVendors });
    } catch (error) {
        console.error('Top vendors error:', error);
        res.status(500).json({ error: 'Failed to fetch top vendors' });
    }
};

// ============================================
// VENDOR ANALYTICS
// ============================================

// Get Vendor Analytics (Vendor specific)
exports.getVendorAnalytics = async (req, res) => {
    try {
        const vendor_id = req.user.id;

        const store = await Store.findOne({ where: { vendor_id } });
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const store_id = store.id;

        const totalOrders = await Order.count({ where: { store_id } });
        const totalRevenue = await Order.sum('total', { where: { store_id, payment_status: 'paid' } });
        const totalProducts = await Product.count({ where: { store_id } });
        const pendingOrders = await Order.count({ where: { store_id, status: 'pending' } });
        const deliveredOrders = await Order.count({ where: { store_id, status: 'delivered' } });
        const rating = store.rating || 0;

        res.json({
            analytics: {
                store_name: store.store_name,
                total_orders: totalOrders,
                total_revenue: totalRevenue || 0,
                total_products: totalProducts,
                pending_orders: pendingOrders,
                delivered_orders: deliveredOrders,
                rating: rating
            }
        });

    } catch (error) {
        console.error('Vendor analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor analytics' });
    }
};

// ============================================
// CUSTOMER ANALYTICS
// ============================================

// Get Customer Analytics (Customer specific)
exports.getCustomerAnalytics = async (req, res) => {
    try {
        const customer_id = req.user.id;

        const totalOrders = await Order.count({ where: { customer_id } });
        const totalSpent = await Order.sum('total', { where: { customer_id, payment_status: 'paid' } });
        const totalDelivered = await Order.count({ where: { customer_id, status: 'delivered' } });
        const totalCancelled = await Order.count({ where: { customer_id, status: 'cancelled' } });

        const recentOrders = await Order.findAll({
            where: { customer_id },
            order: [['created_at', 'DESC']],
            limit: 5
        });

        res.json({
            analytics: {
                total_orders: totalOrders,
                total_spent: totalSpent || 0,
                total_delivered: totalDelivered,
                total_cancelled: totalCancelled,
                recent_orders: recentOrders
            }
        });

    } catch (error) {
        console.error('Customer analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch customer analytics' });
    }
};

// ============================================
// DRIVER ANALYTICS
// ============================================

// Get Driver Analytics (Driver specific)
exports.getDriverAnalytics = async (req, res) => {
    try {
        const driver_id = req.user.id;

        const totalDeliveries = await Delivery.count({ where: { driver_id } });
        const completedDeliveries = await Delivery.count({ where: { driver_id, status: 'delivered' } });
        const failedDeliveries = await Delivery.count({ where: { driver_id, status: 'failed' } });
        const pendingDeliveries = await Delivery.count({ where: { driver_id, status: 'assigned' } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDeliveries = await Delivery.count({
            where: {
                driver_id,
                created_at: { [Op.gte]: today }
            }
        });

        const rating = 4.5;

        res.json({
            analytics: {
                total_deliveries: totalDeliveries,
                completed_deliveries: completedDeliveries,
                failed_deliveries: failedDeliveries,
                pending_deliveries: pendingDeliveries,
                today_deliveries: todayDeliveries,
                rating: rating,
                completion_rate: totalDeliveries > 0 ? (completedDeliveries / totalDeliveries * 100).toFixed(1) : 0
            }
        });

    } catch (error) {
        console.error('Driver analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch driver analytics' });
    }
};