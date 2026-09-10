// backend/src/controllers/liveController.cjs
const { Op } = require('sequelize');
const sequelize = require('../config/database.cjs');
const User = require('../models/User.cjs');
const Order = require('../models/Order.cjs');
const Store = require('../models/Store.cjs');
const Delivery = require('../models/Delivery.cjs');
const Product = require('../models/Product.cjs');

// ============================================
// LIVE DASHBOARD DATA - REAL-TIME
// ============================================
exports.getLiveStats = async (req, res) => {
    try {
        const now = new Date();

        // ============================================
        // 1. TODAY'S STATS (from midnight)
        // ============================================
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRevenue = await Order.sum('total', {
            where: {
                created_at: { [Op.gte]: today },
                status: 'delivered'
            }
        });

        const todayOrders = await Order.count({
            where: {
                created_at: { [Op.gte]: today }
            }
        });

        const todayNewUsers = await User.count({
            where: {
                created_at: { [Op.gte]: today }
            }
        });

        const todayNewVendors = await User.count({
            where: {
                role: 'vendor',
                created_at: { [Op.gte]: today }
            }
        });

        // ============================================
        // 2. LIVE (Real-time) COUNTS
        // ============================================
        const totalRevenue = await Order.sum('total', {
            where: { status: 'delivered' }
        });

        const totalOrders = await Order.count();

        const totalUsers = await User.count();
        const totalVendors = await User.count({ where: { role: 'vendor' } });
        const totalDrivers = await User.count({ where: { role: 'driver' } });

        // Active users - fallback to total users
        const activeUsers = totalUsers;

        // ============================================
        // 3. PENDING ITEMS
        // ============================================
        const pendingOrders = await Order.count({
            where: { status: 'pending' }
        });

        const pendingVendors = await Store.count({
            where: { is_approved: false }
        });

        const pendingProducts = await Product.count({
            where: { is_active: false }
        });

        // ============================================
        // 4. DELIVERY STATUS
        // ============================================
        const deliveriesInTransit = await Delivery.count({
            where: {
                status: ['assigned', 'picked_up', 'in_transit']
            }
        });

        const deliveriesDelivered = await Delivery.count({
            where: { status: 'delivered' }
        });

        const deliveriesFailed = await Delivery.count({
            where: { status: ['failed', 'cancelled'] }
        });

        // ============================================
        // 5. ESCROW STATUS
        // ============================================
        const escrowHeld = await Order.sum('escrow_amount', {
            where: { escrow_status: 'held' }
        });

        const escrowReleased = await Order.sum('escrow_amount', {
            where: { escrow_status: 'released' }
        });

        // ============================================
        // 6. PLATFORM FEE (10%)
        // ============================================
        const platformFee = (totalRevenue || 0) * 0.10;

        // ============================================
        // 7. RECENT ORDERS (Last 10) - FIXED ALIAS
        // ============================================
        const recentOrders = await Order.findAll({
            limit: 10,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: Store,
                    as: 'orderstore',  // ✅ FIXED: Changed from 'store' to 'orderstore'
                    attributes: ['id', 'store_name']
                }
            ]
        });

        const formattedOrders = recentOrders.map(order => ({
            id: order.id,
            order_number: order.order_number || order.id?.slice(0, 8) || 'N/A',
            customer_name: order.customer ? 
                `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() || 'Customer' 
                : 'Customer',
            store_name: order.orderstore?.store_name || 'Vendor',
            total: parseFloat(order.total) || 0,
            status: order.status || 'pending',
            created_at: order.created_at
        }));

        // ============================================
        // 8. REVENUE TREND (Last 7 days)
        // ============================================
        const revenueTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const dailyRevenue = await Order.sum('total', {
                where: {
                    created_at: { [Op.between]: [date, nextDate] },
                    status: 'delivered'
                }
            });
            
            revenueTrend.push({
                label: date.toLocaleDateString('en-KE', { weekday: 'short' }),
                revenue: dailyRevenue || 0
            });
        }

        // ============================================
        // 9. TOP VENDORS (By revenue) - FIXED ALIAS
        // ============================================
        const topVendors = await Order.findAll({
            attributes: [
                'store_id',
                [sequelize.fn('SUM', sequelize.col('total')), 'total_revenue'],
               [sequelize.fn('COUNT', sequelize.col('Order.id')), 'order_count']
            ],
            where: { status: 'delivered' },
            include: [
                {
                    model: Store,
                    as: 'orderstore',  // ✅ FIXED: Changed from 'store' to 'orderstore'
                    attributes: ['id', 'store_name']
                }
            ],
            group: ['store_id', 'orderstore.id'],
            order: [[sequelize.fn('SUM', sequelize.col('total')), 'DESC']],
            limit: 5
        });

        // ============================================
        // 10. RESPONSE
        // ============================================
        return res.json({
            success: true,
            timestamp: now.toISOString(),
            
            stats: {
                totalRevenue: totalRevenue || 0,
                totalOrders: totalOrders || 0,
                totalUsers: totalUsers || 0,
                totalVendors: totalVendors || 0,
                totalDrivers: totalDrivers || 0,
                activeUsers: activeUsers || 0,
                pendingOrders: pendingOrders || 0,
                pendingVendors: pendingVendors || 0,
                pendingProducts: pendingProducts || 0,
                platformFee: platformFee || 0,
                escrowHeld: escrowHeld || 0,
                escrowReleased: escrowReleased || 0,
            },
            
            today: {
                revenue: todayRevenue || 0,
                orders: todayOrders || 0,
                newUsers: todayNewUsers || 0,
                newVendors: todayNewVendors || 0,
            },
            
            deliveries: {
                inTransit: deliveriesInTransit || 0,
                delivered: deliveriesDelivered || 0,
                failed: deliveriesFailed || 0,
            },
            
            revenueTrend: revenueTrend,
            recentOrders: formattedOrders,
            topVendors: topVendors.map(v => ({
                store_name: v.orderstore?.store_name || 'Unknown Vendor',
                total_revenue: parseFloat(v.dataValues.total_revenue) || 0,
                order_count: parseInt(v.dataValues.order_count) || 0
            }))
        });

    } catch (error) {
        console.error('❌ Live stats error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch live stats',
            details: error.message
        });
    }
};