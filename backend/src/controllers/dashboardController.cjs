// backend/src/controllers/dashboardController.cjs
const User = require('../models/User.cjs');
const Vendor = require('../models/Vendor.cjs');
const Order = require('../models/Order.cjs');
const Product = require('../models/Product.cjs');
const { Op } = require('sequelize');

// Get dashboard statistics
exports.getStats = async (req, res) => {
    try {
        // Get real counts from database
        const [totalUsers, totalVendors, totalOrders, totalProducts] = await Promise.all([
            User.count(),
            Vendor.count(),
            Order.count(),
            Product.count()
        ]);

        // Calculate total revenue from orders
        const revenueResult = await Order.sum('total_amount', {
            where: { status: 'completed' }
        });

        // Get recent orders
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, attributes: ['first_name', 'last_name', 'email'] }
            ]
        });

        // Get recent users
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at']
        });

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayOrders = await Order.count({
            where: { created_at: { [Op.gte]: today } }
        });

        const todayUsers = await User.count({
            where: { created_at: { [Op.gte]: today } }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalVendors,
                totalOrders,
                totalRevenue: revenueResult || 0,
                todayOrders,
                todayUsers
            },
            recentOrders,
            recentUsers
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch dashboard statistics' 
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

        // Get order data for chart
        const orders = await Order.findAll({
            where: {
                created_at: { [Op.gte]: startDate }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
            ],
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
        });

        res.json({
            success: true,
            chartData: orders
        });
    } catch (error) {
        console.error('Chart data error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch chart data' 
        });
    }
};