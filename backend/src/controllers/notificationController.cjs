// backend/src/controllers/notificationController.cjs
const Notification = require('../models/Notification.cjs');
const User = require('../models/User.cjs');
const Order = require('../models/Order.cjs');
const Delivery = require('../models/Delivery.cjs');
const Store = require('../models/Store.cjs');
const { Op } = require('sequelize');  // ✅ ADD THIS if not already there
const sequelize = require('../config/database.cjs');  // ✅ ADD THIS
// ============================================
// CREATE NOTIFICATION (Internal Use)
// ============================================
exports.createNotification = async (user_id, type, title, message, data = {}, channel = 'in_app', link = null) => {
    try {
        const notification = await Notification.create({
            user_id,
            type,
            title,
            message,
            data: data || {},
            channel,
            link,
            sent_at: new Date()
        });

        console.log(`🔔 Notification sent to ${user_id}: ${title}`);
        return notification;
    } catch (error) {
        console.error('❌ Create notification error:', error);
        return null;
    }
};

// ============================================
// CREATE ORDER NOTIFICATIONS (Customer + Vendor + Admin)
// ============================================
exports.createOrderNotifications = async (order, customer, vendor, store) => {
    try {
        // 1. Notification to Customer
        await exports.createNotification(
            customer.id,
            'order_placed',
            '📦 Order Placed',
            `Your order #${order.order_number} has been placed successfully! Total: KES ${order.total}`,
            {
                order_id: order.id,
                order_number: order.order_number,
                total: order.total,
                status: order.status,
                customer_id: customer.id,
                customer_name: `${customer.first_name} ${customer.last_name}`
            },
            'in_app',
            `/dashboard/orders/${order.id}`
        );

        // 2. Notification to Vendor
        await exports.createNotification(
            vendor.id,
            'order_placed',
            '📦 New Order Received',
            `New order #${order.order_number} from ${customer.first_name} ${customer.last_name} - KES ${order.total}`,
            {
                order_id: order.id,
                order_number: order.order_number,
                customer_id: customer.id,
                customer_name: `${customer.first_name} ${customer.last_name}`,
                total: order.total,
                store_id: store.id,
                store_name: store.store_name
            },
            'in_app',
            `/vendor/orders/${order.id}`
        );

        // 3. ✅ ADMIN: System-wide order notification
        const adminUsers = await User.findAll({ where: { role: 'admin' } });
        for (const admin of adminUsers) {
            await exports.createNotification(
                admin.id,
                'admin_order_placed',
                '📦 New Order Placed',
                `Order #${order.order_number} placed by ${customer.first_name} ${customer.last_name} - KES ${order.total}`,
                {
                    order_id: order.id,
                    order_number: order.order_number,
                    customer_id: customer.id,
                    customer_name: `${customer.first_name} ${customer.last_name}`,
                    vendor_id: vendor.id,
                    vendor_name: vendor.first_name,
                    store_name: store.store_name,
                    total: order.total,
                    status: order.status
                },
                'in_app',
                `/admin/orders/${order.id}`
            );
        }

        return true;
    } catch (error) {
        console.error('❌ Create order notifications error:', error);
        return false;
    }
};

// ============================================
// CREATE DELIVERY NOTIFICATIONS (Driver + Customer + Vendor + Admin)
// ============================================
exports.createDeliveryNotifications = async (delivery, order, driver, customer, vendor) => {
    try {
        const statusMessages = {
            'assigned': {
                title: '🚚 Delivery Assigned',
                message: `Delivery for order #${order.order_number} assigned to ${driver?.first_name || 'driver'}`,
                icon: 'Truck',
                color: 'blue'
            },
            'picked_up': {
                title: '📦 Order Picked Up',
                message: `Order #${order.order_number} has been picked up by driver ${driver?.first_name || ''}`,
                icon: 'Package',
                color: 'green'
            },
            'in_transit': {
                title: '🚚 Order In Transit',
                message: `Order #${order.order_number} is on the way`,
                icon: 'Navigation',
                color: 'purple'
            },
            'delivered': {
                title: '✅ Order Delivered',
                message: `Order #${order.order_number} has been delivered successfully!`,
                icon: 'CheckCircle',
                color: 'green'
            },
            'failed': {
                title: '❌ Delivery Failed',
                message: `Delivery for order #${order.order_number} failed. Please investigate.`,
                icon: 'XCircle',
                color: 'red'
            },
            'cancelled': {
                title: '🚫 Delivery Cancelled',
                message: `Delivery for order #${order.order_number} has been cancelled`,
                icon: 'XCircle',
                color: 'gray'
            }
        };

        const statusData = statusMessages[delivery.status] || statusMessages['assigned'];

        // 1. Notification to Driver
        if (driver) {
            await exports.createNotification(
                driver.id,
                `delivery_${delivery.status}`,
                statusData.title,
                statusData.message,
                {
                    delivery_id: delivery.id,
                    order_id: order.id,
                    order_number: order.order_number,
                    delivery_address: delivery.delivery_address,
                    delivery_fee: delivery.delivery_fee,
                    status: delivery.status,
                    customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Customer'
                },
                'in_app',
                `/driver/deliveries/${delivery.id}`
            );
        }

        // 2. Notification to Customer
        if (customer) {
            await exports.createNotification(
                customer.id,
                `delivery_${delivery.status}`,
                statusData.title,
                statusData.message,
                {
                    delivery_id: delivery.id,
                    order_id: order.id,
                    order_number: order.order_number,
                    status: delivery.status,
                    driver_name: driver ? `${driver.first_name} ${driver.last_name}` : 'Driver'
                },
                'in_app',
                `/dashboard/orders/${order.id}`
            );
        }

        // 3. Notification to Vendor
        if (vendor) {
            await exports.createNotification(
                vendor.id,
                `delivery_${delivery.status}`,
                `📦 ${statusData.title}`,
                `Delivery update for order #${order.order_number}: ${statusData.message}`,
                {
                    delivery_id: delivery.id,
                    order_id: order.id,
                    order_number: order.order_number,
                    status: delivery.status,
                    driver_id: driver?.id,
                    driver_name: driver ? `${driver.first_name} ${driver.last_name}` : null
                },
                'in_app',
                `/vendor/orders/${order.id}`
            );
        }

        // 4. ✅ ADMIN: System-wide delivery notification
        const adminUsers = await User.findAll({ where: { role: 'admin' } });
        for (const admin of adminUsers) {
            await exports.createNotification(
                admin.id,
                `admin_delivery_${delivery.status}`,
                `📦 Delivery ${delivery.status.replace('_', ' ')}`,
                `Order #${order.order_number} - ${statusData.message}`,
                {
                    delivery_id: delivery.id,
                    order_id: order.id,
                    order_number: order.order_number,
                    status: delivery.status,
                    vendor_name: vendor ? `${vendor.first_name} ${vendor.last_name}` : 'Unknown Vendor',
                    driver_name: driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver',
                    customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer',
                    delivery_address: delivery.delivery_address,
                    delivery_fee: delivery.delivery_fee
                },
                'in_app',
                `/admin/deliveries/${delivery.id}`
            );
        }

        return true;
    } catch (error) {
        console.error('❌ Create delivery notifications error:', error);
        return false;
    }
};

// ============================================
// CREATE ESCROW NOTIFICATION (Vendor + Customer + Admin)
// ============================================
exports.createEscrowNotification = async (order, vendor, amount, platformFee = 0) => {
    try {
        // 1. Notification to Vendor
        await exports.createNotification(
            vendor.id,
            'escrow_released',
            '💰 Payment Released',
            `Payment of KES ${amount} for order #${order.order_number} has been released to your wallet`,
            {
                order_id: order.id,
                order_number: order.order_number,
                amount: amount,
                platform_fee: platformFee,
                status: 'released'
            },
            'in_app',
            `/vendor/wallet`
        );

        // 2. Notification to Customer
        const customer = await User.findByPk(order.customer_id);
        if (customer) {
            await exports.createNotification(
                customer.id,
                'payment_confirmed',
                '✅ Payment Confirmed',
                `Your payment of KES ${amount} for order #${order.order_number} has been confirmed`,
                {
                    order_id: order.id,
                    order_number: order.order_number,
                    amount: amount
                },
                'in_app',
                `/dashboard/orders/${order.id}`
            );
        }

        // 3. ✅ ADMIN: Escrow released notification
        const adminUsers = await User.findAll({ where: { role: 'admin' } });
        for (const admin of adminUsers) {
            await exports.createNotification(
                admin.id,
                'admin_escrow_released',
                '💰 Escrow Released',
                `KES ${amount} released for order #${order.order_number} (10% platform fee: KES ${platformFee})`,
                {
                    order_id: order.id,
                    order_number: order.order_number,
                    amount: amount,
                    platform_fee: platformFee,
                    vendor_id: vendor.id,
                    vendor_name: `${vendor.first_name} ${vendor.last_name}`,
                    customer_id: customer?.id,
                    customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown'
                },
                'in_app',
                `/admin/orders/${order.id}`
            );
        }

        return true;
    } catch (error) {
        console.error('❌ Create escrow notification error:', error);
        return false;
    }
};

// ============================================
// CREATE VENDOR REGISTRATION NOTIFICATION (Admin)
// ============================================
exports.createVendorRegistrationNotification = async (vendor, user) => {
    try {
        const adminUsers = await User.findAll({ where: { role: 'admin' } });
        for (const admin of adminUsers) {
            await exports.createNotification(
                admin.id,
                'vendor_registered',
                '🏪 New Vendor Registered',
                `${user.first_name} ${user.last_name} has registered as a vendor (${vendor.store_name})`,
                {
                    vendor_id: vendor.id,
                    user_id: user.id,
                    user_name: `${user.first_name} ${user.last_name}`,
                    user_email: user.email,
                    store_name: vendor.store_name,
                    store_id: vendor.id
                },
                'in_app',
                `/admin/vendors/${vendor.id}`
            );
        }
        return true;
    } catch (error) {
        console.error('❌ Create vendor registration notification error:', error);
        return false;
    }
};

// ============================================
// CREATE DRIVER REGISTRATION NOTIFICATION (Admin)
// ============================================
exports.createDriverRegistrationNotification = async (driver, user) => {
    try {
        const adminUsers = await User.findAll({ where: { role: 'admin' } });
        for (const admin of adminUsers) {
            await exports.createNotification(
                admin.id,
                'driver_registered',
                '🚗 New Driver Registered',
                `${user.first_name} ${user.last_name} has registered as a driver (${driver.vehicle_type || 'vehicle'})`,
                {
                    driver_id: driver.id,
                    user_id: user.id,
                    user_name: `${user.first_name} ${user.last_name}`,
                    user_email: user.email,
                    vehicle_type: driver.vehicle_type,
                    vehicle_plate: driver.vehicle_plate
                },
                'in_app',
                `/admin/drivers/${driver.id}`
            );
        }
        return true;
    } catch (error) {
        console.error('❌ Create driver registration notification error:', error);
        return false;
    }
};



// ============================================
// GET USER NOTIFICATIONS
// ============================================
exports.getUserNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { limit = 50, offset = 0, unread_only = false } = req.query;

        const where = { user_id };
        if (unread_only === 'true') {
            where.is_read = false;
        }

        const notifications = await Notification.findAndCountAll({
            where,
            attributes: [
                'id', 
                'user_id', 
                'type', 
                'title', 
                'message', 
                'data', 
                'channel', 
                'is_read', 
                'read_at', 
                'sent_at',
                
                'created_at', 
                'updated_at'
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const unreadCount = await Notification.count({ 
            where: { user_id, is_read: false } 
        });

        return res.json({
            success: true,
            total: notifications.count,
            unread: unreadCount,
            notifications: notifications.rows
        });

    } catch (error) {
        console.error('❌ Get notifications error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch notifications',
            message: error.message 
        });
    }
};

// ============================================
// GET RECENT NOTIFICATIONS (For Widget)
// ============================================
exports.getRecentNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;
        const limit = parseInt(req.query.limit) || 5;

        const notifications = await Notification.findAll({
            where: { user_id },
            attributes: [
                'id', 
                'type', 
                'title', 
                'message', 
                'data', 
                'is_read', 
                'created_at'
            ],
            order: [['created_at', 'DESC']],
            limit: limit
        });

        const unreadCount = await Notification.count({ 
            where: { user_id, is_read: false } 
        });

        return res.json({
            success: true,
            unread: unreadCount,
            notifications: notifications
        });

    } catch (error) {
        console.error('❌ Get recent notifications error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch recent notifications',
            message: error.message 
        });
    }
};

// ============================================
// MARK AS READ
// ============================================
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const notification = await Notification.findOne({
            where: { id, user_id }
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        await notification.update({
            is_read: true,
            read_at: new Date()
        });

        res.json({
            success: true,
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        console.error('❌ Mark as read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
};

// ============================================
// MARK ALL AS READ
// ============================================
exports.markAllAsRead = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await Notification.update(
            { is_read: true, read_at: new Date() },
            { where: { user_id, is_read: false } }
        );

        res.json({ 
            success: true, 
            message: `Marked ${result[0]} notifications as read`,
            count: result[0]
        });

    } catch (error) {
        console.error('❌ Mark all as read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all as read' });
    }
};

// ============================================
// DELETE NOTIFICATION
// ============================================
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const notification = await Notification.findOne({
            where: { id, user_id }
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        await notification.destroy();

        res.json({ success: true, message: 'Notification deleted successfully' });

    } catch (error) {
        console.error('❌ Delete notification error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
};

// ============================================
// GET UNREAD COUNT
// ============================================
exports.getUnreadCount = async (req, res) => {
    try {
        const user_id = req.user.id;

        const count = await Notification.count({
            where: { user_id, is_read: false }
        });

        res.json({ success: true, unread_count: count });

    } catch (error) {
        console.error('❌ Get unread count error:', error);
        res.status(500).json({ success: false, error: 'Failed to get unread count' });
    }
};

// ============================================
// ADMIN: GET ALL NOTIFICATIONS (System Wide)
// ============================================
exports.getAllNotifications = async (req, res) => {
    try {
        const { limit = 100, offset = 0, type } = req.query;

        const where = {};
        if (type) where.type = type;

        const notifications = await Notification.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'role']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            total: notifications.count,
            notifications: notifications.rows
        });

    } catch (error) {
        console.error('❌ Get all notifications error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch notifications',
            message: error.message 
        });
    }
};

// ============================================
// BULK CREATE NOTIFICATIONS (For Broadcast)
// ============================================
exports.broadcastNotification = async (req, res) => {
    try {
        const { user_ids, type, title, message, data = {}, link = null } = req.body;

        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'user_ids array is required' 
            });
        }

        if (!type || !title || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'type, title, and message are required' 
            });
        }

        const notifications = [];
        for (const user_id of user_ids) {
            const notification = await exports.createNotification(
                user_id,
                type,
                title,
                message,
                data,
                'in_app',
                link
            );
            if (notification) {
                notifications.push(notification);
            }
        }

        res.json({
            success: true,
            message: `Broadcasted to ${notifications.length} users`,
            count: notifications.length
        });

    } catch (error) {
        console.error('❌ Broadcast notification error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to broadcast notification',
            message: error.message 
        });
    }
};

// ============================================
// DELETE ALL NOTIFICATIONS (User)
// ============================================
exports.deleteAllNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await Notification.destroy({
            where: { user_id }
        });

        res.json({
            success: true,
            message: `Deleted ${result} notifications`,
            count: result
        });

    } catch (error) {
        console.error('❌ Delete all notifications error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notifications' });
    }
};

// ============================================
// ADMIN: GET ALL NOTIFICATIONS (System Wide)
// ============================================
exports.getAllNotifications = async (req, res) => {
    try {
        const { limit = 100, offset = 0, type } = req.query;

        const where = {};
        if (type) where.type = type;

        const notifications = await Notification.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'role']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            total: notifications.count,
            notifications: notifications.rows
        });

    } catch (error) {
        console.error('❌ Get all notifications error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications',
            message: error.message
        });
    }
};

// ============================================
// ADMIN: BROADCAST NOTIFICATION
// ============================================
exports.broadcastNotification = async (req, res) => {
    try {
        const { user_ids, type, title, message, data = {}, link = null } = req.body;

        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'user_ids array is required'
            });
        }

        if (!type || !title || !message) {
            return res.status(400).json({
                success: false,
                error: 'type, title, and message are required'
            });
        }

        const notifications = [];
        for (const user_id of user_ids) {
            const notification = await exports.createNotification(
                user_id,
                type,
                title,
                message,
                data,
                'in_app',
                link
            );
            if (notification) {
                notifications.push(notification);
            }
        }

        res.json({
            success: true,
            message: `Broadcasted to ${notifications.length} users`,
            count: notifications.length
        });

    } catch (error) {
        console.error('❌ Broadcast notification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to broadcast notification',
            message: error.message
        });
    }
};

// ============================================
// ADMIN: GET NOTIFICATION STATS
// ============================================
exports.getNotificationStats = async (req, res) => {
    try {
        const total = await Notification.count();
        const unread = await Notification.count({ where: { is_read: false } });
        const read = await Notification.count({ where: { is_read: true } });

        // Get notifications by type
        const byType = await Notification.findAll({
            attributes: [
                'type',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['type'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
            limit: 10
        });

        // Get today's notifications
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Notification.count({
            where: {
                created_at: { [Op.gte]: today }
            }
        });

        res.json({
            success: true,
            stats: {
                total,
                unread,
                read,
                today: todayCount,
                byType: byType.map(item => ({
                    type: item.type,
                    count: parseInt(item.dataValues.count)
                }))
            }
        });

    } catch (error) {
        console.error('❌ Get notification stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notification stats',
            message: error.message
        });
    }
};

// ============================================
// ADMIN: TEST NOTIFICATION
// ============================================
exports.testNotification = async (req, res) => {
    try {
        const user_id = req.user.id;

        const notification = await exports.createNotification(
            user_id,
            'success',
            '✅ Test Notification',
            'This is a test notification from the admin panel.',
            { test: true, timestamp: new Date().toISOString() },
            'in_app',
            '/admin/dashboard'
        );

        res.json({
            success: true,
            message: 'Test notification sent',
            notification
        });

    } catch (error) {
        console.error('❌ Test notification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send test notification',
            message: error.message
        });
    }
};