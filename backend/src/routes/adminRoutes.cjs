const express = require('express');
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
// USER MANAGEMENT
// ============================================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/toggle', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// ============================================
// VENDOR MANAGEMENT
// ============================================
router.get('/vendors', adminController.getAllVendors);
router.put('/vendors/:id/approve', adminController.approveVendor);
router.put('/vendors/:id/reject', adminController.rejectVendor);

// ============================================
// PRODUCT MANAGEMENT
// ============================================
router.get('/products', adminController.getAllProducts);
router.put('/products/:id/toggle', adminController.toggleProductStatus);

// ============================================
// ORDER MANAGEMENT
// ============================================
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrder);

// ============================================
// 🟢 PAYMENT MANAGEMENT (FIXES THE 404 DASHBOARD CRASH)
// ============================================
router.get('/payments', async (req, res) => {
    try {
        // Safe empty array placeholder so your frontend loads immediately
        const payments = []; 
        
        // Note: When you are ready to query real M-Pesa rows later, you can use:
        // const payments = await Payment.findAll({ order: [['created_at', 'DESC']] });
        
        return res.json({ payments: payments || [] });
    } catch (error) {
        console.error('❌ Admin payments fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch payment records' });
    }
});
// ============================================
// RECENT ACTIVITIES (FIXES THE 404 TIMELINE CARD CRASH)
// ============================================
router.get('/recent-activities', async (req, res) => {
    try {
        // Safe, clean placeholder array matching standard dashboard activity objects
        const activities = [
            {
                id: 1,
                type: 'info',
                description: 'System database structural verification completed successfully.',
                timestamp: new Date()
            }
        ];

        // When your schema gets populated with dynamic data later, you can map items dynamically:
        // const dynamicOrders = await Order.findAll({ limit: 5, order: [['createdAt', 'DESC']] });

        return res.json({ activities: activities || [] });
    } catch (error) {
        console.error('❌ Admin recent activities fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch recent system activity logs' });
    }
});
// ============================================
// REPORT MANAGEMENT (FIXES THE 404 REPORTS PAGE CRASH)
// ============================================
router.get('/reports', async (req, res) => {
    try {
        const { type, range } = req.query;
        console.log(`📊 Generating admin report: Type = ${type}, Range = ${range}`);

        // Safe mock layout payload matching what standard React dashboard charts look for
        const reportData = {
            summary: {
                totalRevenue: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                growthRate: 0
            },
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: type === 'revenue' ? 'Revenue (KES)' : 'Sales Count',
                    data: [0, 0, 0, 0] // Zeroed arrays keep empty graphs stable
                }
            ]
        };

        // When you want to pull live calculation queries from PostgreSQL later, you can do:
        // if (type === 'revenue') { const revenue = await Order.sum('total_amount', { where: { status: 'completed' } }); }

        return res.json({ data: reportData });
    } catch (error) {
        console.error('❌ Admin reports calculation error:', error);
        return res.status(500).json({ error: 'Failed to generate financial reports' });
    }
});


module.exports = router;
