const express = require('express');
const Order = require('../models/Order.cjs');
const User = require('../models/User.cjs');
const router = express.Router();
const adminController = require('../controllers/adminController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// All admin routes require authentication AND admin role
router.use(authMiddleware);
router.use(authorize('admin'));

// ============================================
// DASHBOARD
// ============================================
router.get('/dashboard', adminController.getAdminDashboardStats);

// ============================================
// ANALYTICS
// ============================================
router.get('/analytics', adminController.getAnalytics);

// ============================================
// CHART DATA FOR DASHBOARD
// ============================================
router.get('/order-status', adminController.getOrderStatus);
router.get('/revenue', adminController.getRevenueData);
router.get('/user-growth', adminController.getUserGrowthData);

// ============================================
// REPORT MANAGEMENT - REAL DATA
// ============================================
router.get('/reports', adminController.getReports);

// ============================================
// USER MANAGEMENT
// ============================================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/toggle', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// ============================================
// VENDOR MANAGEMENT
// ============================================
// Static route first
router.get('/vendors/pending', async (req, res) => {
    try {
        const pendingVendors = await User.findAll({
            where: { role: 'vendor' },
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'created_at']
        });

        return res.json({ 
            success: true, 
            vendors: pendingVendors || [] 
        });
    } catch (error) {
        console.error('❌ Admin pending vendors fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch pending registration requests' });
    }
});
// ============================================
// VENDOR MANAGEMENT - DETAILED ROUTES
// ============================================

// Get single vendor
router.get('/vendors/:id', adminController.getVendorById);

// Activate vendor
router.put('/vendors/:id/activate', adminController.activateVendor);

// Deactivate vendor
router.put('/vendors/:id/deactivate', adminController.deactivateVendor);
// Dynamic vendor routes
router.get('/vendors', adminController.getAllVendors);
router.put('/vendors/:id/approve', adminController.approveVendor);
router.put('/vendors/:id/reject', adminController.rejectVendor);

// ============================================
// PRODUCT MANAGEMENT (No Delete!)
// ============================================
router.get('/products', adminController.getAllProducts);
router.put('/products/:id/toggle', adminController.toggleProductStatus);
router.put('/products/:id/approve', adminController.approveProduct);
router.put('/products/:id/reject', adminController.rejectProduct);
router.put('/products/:id/unreject', adminController.unrejectProduct);

// ============================================
// ORDER MANAGEMENT
// ============================================
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrder);

// ============================================
// PAYMENT MANAGEMENT
// ============================================
router.get('/payments', async (req, res) => {
    try {
        const payments = []; 
        return res.json({ payments: payments || [] });
    } catch (error) {
        console.error('❌ Admin payments fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch payment records' });
    }
});

// ============================================
// RECENT ACTIVITIES - REAL DATA
// ============================================
router.get('/recent-activities', async (req, res) => {
    try {
        // ✅ Fetch real recent orders and users
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, as: 'customer', attributes: ['first_name', 'last_name', 'email'] }
            ]
        });

        const recentUsers = await User.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at']
        });

        // Format activities
        const activities = [
            ...recentOrders.map(order => ({
                id: order.id,
                type: 'order_placed',
                action: `Order #${order.id?.slice(0, 8)} placed`,
                user: order.customer?.first_name 
                    ? `${order.customer.first_name} ${order.customer.last_name || ''}` 
                    : 'Customer',
                created_at: order.created_at
            })),
            ...recentUsers.map(user => ({
                id: user.id,
                type: 'customer_joined',
                action: `${user.first_name} ${user.last_name || ''} joined as ${user.role}`,
                user: user.email,
                created_at: user.created_at
            }))
        ];

        // Sort by date and take latest 5
        const sortedActivities = activities
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

        return res.json({ 
            success: true,
            activities: sortedActivities 
        });

    } catch (error) {
        console.error('❌ Admin recent activities fetch error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to fetch recent activity logs',
            details: error.message
        });
    }
});

module.exports = router;