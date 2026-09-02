const User = require('../models/User.cjs');
const Vendor = require('../models/Vendor.cjs');
const Order = require('../models/Order.cjs');
const Product = require('../models/Product.cjs');
const { Op } = require('sequelize');
const sequelize = require('../config/database.cjs');

// Get dashboard statistics
exports.getStats = async (req, res) => {
    try {
        // Safe count fetching
        const totalUsers = await User.count().catch(() => 0);
        const totalVendors = await Vendor.count().catch(() => 0);
        const totalOrders = await Order.count().catch(() => 0);
        const totalProducts = await Product.count().catch(() => 0);

        // Get pending vendors count
        let pendingVendors = 0;
        try {
            pendingVendors = await Vendor.count({
                where: { 
                    is_approved: false,
                    status: 'pending'
                }
            }).catch(() => 0);
        } catch (err) {
            console.warn('⚠️ Could not count pending vendors:', err.message);
            pendingVendors = 0;
        }

        // Safe revenue sum with fallback
        let revenueResult = 0;
        try {
            revenueResult = await Order.sum('total_amount', {
                where: { status: 'completed' }
            });
        } catch (dbError) {
            console.warn("⚠️ total_amount column mismatch. Attempting fallback column 'total'...");
            try {
                revenueResult = await Order.sum('total', {
                    where: { status: 'completed' }
                });
            } catch (fallbackError) {
                console.error("❌ Both total_amount and total columns failed to sum.");
                revenueResult = 0;
            }
        }

        // Safe order sorting with fallback timestamps
        let recentOrders = [];
        try {
            recentOrders = await Order.findAll({
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [
                    { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] }
                ]
            });
        } catch (orderErr) {
            console.warn("⚠️ Fallback to createdAt for orders...");
            try {
                recentOrders = await Order.findAll({
                    limit: 5,
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] }
                    ]
                });
            } catch (err) {
                recentOrders = [];
            }
        }

        // Safe user sorting
        let recentUsers = [];
        try {
            recentUsers = await User.findAll({
                limit: 5,
                order: [['created_at', 'DESC']],
                attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at']
            });
        } catch (userErr) {
            console.warn("⚠️ Fallback to createdAt for users...");
            try {
                recentUsers = await User.findAll({
                    limit: 5,
                    order: [['createdAt', 'DESC']],
                    attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'createdAt']
                });
            } catch (err) {
                recentUsers = [];
            }
        }

        // Get today's metrics safely
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let todayOrders = 0;
        try {
            todayOrders = await Order.count({
                where: { created_at: { [Op.gte]: today } }
            });
        } catch (err) {
            try {
                todayOrders = await Order.count({
                    where: { createdAt: { [Op.gte]: today } }
                });
            } catch (err2) {
                todayOrders = 0;
            }
        }

        let todayUsers = 0;
        try {
            todayUsers = await User.count({
                where: { created_at: { [Op.gte]: today } }
            });
        } catch (err) {
            try {
                todayUsers = await User.count({
                    where: { createdAt: { [Op.gte]: today } }
                });
            } catch (err2) {
                todayUsers = 0;
            }
        }

        return res.json({
            success: true,
            stats: {
                totalUsers,
                totalVendors,
                pendingVendors,  // ✅ Added pending vendors count
                totalOrders,
                totalRevenue: revenueResult || 0,
                todayOrders,
                todayUsers
            },
            recentOrders,
            recentUsers
        });
    } catch (error) {
        console.error('❌ Dashboard stats error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch dashboard statistics',
            message: error.message
        });
    }
};

// Get chart data (for dashboard charts)
exports.getChartData = async (req, res) => {
    try {
        const { period = 'week' } = req.query;
        let startDate = new Date();
        
        if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        let orders = [];
        try {
            orders = await Order.findAll({
                where: { created_at: { [Op.gte]: startDate } },
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
                ],
                group: [sequelize.fn('DATE', sequelize.col('created_at'))],
                order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
            });
        } catch (err) {
            console.warn("⚠️ Chart mapping falling back to standard schema names (createdAt/total)...");
            try {
                orders = await Order.findAll({
                    where: { createdAt: { [Op.gte]: startDate } },
                    attributes: [
                        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'revenue']
                    ],
                    group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                    order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
                });
            } catch (err2) {
                orders = [];
            }
        }

        return res.json({
            success: true,
            chartData: orders || []
        });
    } catch (error) {
        console.error('❌ Chart data error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch chart data' 
        });
    }
};