const User = require('../models/User.cjs');
const Store = require('../models/Store.cjs');
const Product = require('../models/Product.cjs');
const Order = require('../models/Order.cjs');
const Category = require('../models/Category.cjs');
const Campus = require('../models/Campus.cjs');
const { Op } = require('sequelize');

// ============================================
// USER MANAGEMENT
// ============================================

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (role) where.role = role;

        const users = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password_hash'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            total: users.count,
            pages: Math.ceil(users.count / limit),
            current_page: parseInt(page),
            users: users.rows
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Block/Unblock User
exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({ is_active });

        res.json({
            message: `User ${is_active ? 'activated' : 'blocked'} successfully`,
            user
        });

    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();

        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// ============================================
// VENDOR MANAGEMENT
// ============================================

// Get All Vendors (with stores)
exports.getAllVendors = async (req, res) => {
    try {
        const { is_approved, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (is_approved !== undefined) where.is_approved = is_approved === 'true';

        const stores = await Store.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            total: stores.count,
            pages: Math.ceil(stores.count / limit),
            current_page: parseInt(page),
            vendors: stores.rows
        });

    } catch (error) {
        console.error('Get vendors error:', error);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

// Approve Vendor Store
exports.approveVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const store = await Store.findByPk(id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        await store.update({ is_approved: true });

        res.json({
            message: 'Vendor approved successfully',
            store
        });

    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({ error: 'Failed to approve vendor' });
    }
};

// Reject Vendor Store
exports.rejectVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const store = await Store.findByPk(id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        await store.update({ is_approved: false, is_active: false });

        res.json({
            message: 'Vendor rejected successfully',
            store
        });

    } catch (error) {
        console.error('Reject vendor error:', error);
        res.status(500).json({ error: 'Failed to reject vendor' });
    }
};

// ============================================
// PRODUCT MANAGEMENT
// ============================================

// Get All Products (Admin)
exports.getAllProducts = async (req, res) => {
    try {
        const { is_active, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (is_active !== undefined) where.is_active = is_active === 'true';

        const products = await Product.findAndCountAll({
            where,
            include: [{
                model: Store,
                as: 'store', 
                attributes: ['store_name', 'id']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            total: products.count,
            pages: Math.ceil(products.count / limit),
            current_page: parseInt(page),
            products: products.rows
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Toggle Product Active Status
exports.toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.update({ is_active });

        res.json({
            message: `Product ${is_active ? 'activated' : 'deactivated'}`,
            product
        });

    } catch (error) {
        console.error('Toggle product status error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// ============================================
// ORDER MANAGEMENT
// ============================================

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;

        const orders = await Order.findAndCountAll({
            where,
            include: [
                { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
               { model: Store, as: 'store', attributes: ['id', 'store_name'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            total: orders.count,
            pages: Math.ceil(orders.count / limit),
            current_page: parseInt(page),
            orders: orders.rows
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Update Order (Admin)
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.update(updates);

        res.json({
            message: 'Order updated successfully',
            order
        });

    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// ============================================
// DASHBOARD STATS (Admin Overview)
// ============================================

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalVendors = await User.count({ where: { role: 'vendor' } });
        const totalCustomers = await User.count({ where: { role: 'customer' } });
        const totalDrivers = await User.count({ where: { role: 'driver' } });
        const totalStores = await Store.count();
        const pendingStores = await Store.count({ where: { is_approved: false } });
        const totalProducts = await Product.count();
        const activeProducts = await Product.count({ where: { is_active: true } });
        const totalOrders = await Order.count();
        const pendingOrders = await Order.count({ where: { status: 'pending' } });
        const deliveredOrders = await Order.count({ where: { status: 'delivered' } });
        const totalRevenue = await Order.sum('total', { where: { payment_status: 'paid' } });

        return res.json({
            stats: {
                users: {
                    total: totalUsers,
                    vendors: totalVendors,
                    customers: totalCustomers,
                    drivers: totalDrivers
                },
                stores: {
                    total: totalStores,
                    pending: pendingStores
                },
                products: {
                    total: totalProducts,
                    active: activeProducts
                },
                orders: {
                    total: totalOrders,
                    pending: pendingOrders,
                    delivered: deliveredOrders
                },
                revenue: totalRevenue || 0
            },
            recent: {
                orders: [],
                users: []
            }
        });
    } catch (error) {
        console.error('Admin dashboard stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
    }
};
// ============================================
// ANALYTICS
// ============================================
exports.getAnalytics = async (req, res) => {
    try {
        // Return empty data structure for now
        // This will be populated with real data later
        res.json({
            revenue: [
                { month: 'Jan', revenue: 0 },
                { month: 'Feb', revenue: 0 },
                { month: 'Mar', revenue: 0 },
                { month: 'Apr', revenue: 0 },
                { month: 'May', revenue: 0 },
                { month: 'Jun', revenue: 0 },
                { month: 'Jul', revenue: 0 },
                { month: 'Aug', revenue: 0 }
            ],
            userGrowth: [
                { month: 'Jan', users: 0 },
                { month: 'Feb', users: 0 },
                { month: 'Mar', users: 0 },
                { month: 'Apr', users: 0 },
                { month: 'May', users: 0 },
                { month: 'Jun', users: 0 },
                { month: 'Jul', users: 0 },
                { month: 'Aug', users: 0 }
            ],
            orderStatus: [
                { name: 'Delivered', value: 0 },
                { name: 'Processing', value: 0 },
                { name: 'Pending', value: 0 },
                { name: 'Cancelled', value: 0 }
            ]
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};