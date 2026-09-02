const Delivery = require('../models/Delivery.cjs');
const Order = require('../models/Order.cjs');
const Store = require('../models/Store.cjs');
const User = require('../models/User.cjs');
const Wallet = require('../models/Wallet.cjs');
const Driver = require('../models/Driver.cjs');
const Notification = require('../models/Notification.cjs');
const { Op } = require('sequelize');

// ============================================
// HELPER: Create Notification
// ============================================
async function createNotification(userId, type, title, message, data = {}, link = null) {
    try {
        const notification = await Notification.create({
            user_id: userId,
            type: type,
            title: title,
            message: message,
            data: data,
            link: link,
            sent_at: new Date()
        });
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        return null;
    }
}

// ============================================
// HELPER: Send Delivery Code to Customer
// ============================================
async function sendDeliveryCodeToCustomer(customerId, orderNumber, code) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) return;

        const message = `🔑 Your AgriVibe delivery code for order #${orderNumber} is: ${code}\n\nGive this code to your driver only when you receive your items.\n\nThank you for choosing AgriVibe! 🌾`;

        // Create in-app notification
        await createNotification(
            customerId,
            'info',
            '🔑 Delivery Code',
            `Your delivery code for order #${orderNumber} is: ${code}`,
            { order_number: orderNumber, delivery_code: code },
            '/dashboard/orders'
        );

        if (customer.phone) {
            console.log(`📱 SMS sent to ${customer.phone}: ${message}`);
        }

        if (customer.email) {
            console.log(`📧 Email sent to ${customer.email}: ${message}`);
        }

    } catch (error) {
        console.error('Send delivery code error:', error);
    }
}

// ============================================
// CREATE DELIVERY (Vendor/Admin)
// ============================================
exports.createDelivery = async (req, res) => {
    try {
        const {
            order_id, driver_id, pickup_address, delivery_address,
            pickup_lat, pickup_lng, delivery_lat, delivery_lng,
            delivery_fee, estimated_time, customer_notes
        } = req.body;

        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const existingDelivery = await Delivery.findOne({ where: { order_id } });
        if (existingDelivery) {
            return res.status(400).json({ error: 'Delivery already created for this order' });
        }

        // Get store/vendor info
        const store = await Store.findByPk(order.store_id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Get delivery code from order
        const deliveryCode = order.delivery_code || Math.floor(100000 + Math.random() * 900000).toString();

        const delivery = await Delivery.create({
            order_id,
            driver_id,
            vendor_id: store.id,
            pickup_address,
            delivery_address,
            pickup_lat,
            pickup_lng,
            delivery_lat,
            delivery_lng,
            delivery_fee: delivery_fee || 0,
            estimated_time,
            customer_notes,
            status: 'assigned',
            delivery_code: deliveryCode,
            escrow_amount: order.escrow_amount || order.total,
            escrow_released: false
        });

        // Update order delivery status
        await order.update({ delivery_status: 'assigned' });

        // ✅ NOTIFICATION: Send to driver if assigned
        if (driver_id) {
            const driver = await User.findByPk(driver_id);
            if (driver) {
                await createNotification(
                    driver_id,
                    'delivery_assigned',
                    '🚚 New Delivery Assigned',
                    `You have been assigned a delivery for order #${order.order_number}`,
                    { 
                        order_id: order.id, 
                        order_number: order.order_number,
                        delivery_id: delivery.id,
                        delivery_address: delivery_address,
                        delivery_fee: delivery_fee
                    },
                    `/driver/deliveries/${delivery.id}`
                );
            }
        }

        // ✅ NOTIFICATION: Send to vendor
        if (store.vendor_id) {
            await createNotification(
                store.vendor_id,
                'delivery_created',
                '📦 Delivery Created',
                `Delivery created for order #${order.order_number}`,
                { 
                    order_id: order.id, 
                    order_number: order.order_number,
                    delivery_id: delivery.id,
                    delivery_address: delivery_address
                },
                `/vendor/orders/${order.id}`
            );
        }

        res.status(201).json({
            message: 'Delivery created successfully',
            delivery,
            delivery_code: deliveryCode
        });

    } catch (error) {
        console.error('Create delivery error:', error);
        res.status(500).json({ error: 'Failed to create delivery' });
    }
};

// ============================================
// GET DELIVERY BY ID
// ============================================
exports.getDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;
        const delivery = await Delivery.findByPk(id, {
            include: [
                { model: User, as: 'driver', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
                { model: Order, as: 'order', attributes: ['id', 'order_number', 'total', 'status'] },
                { model: Store, as: 'vendor', attributes: ['id', 'store_name'] }
            ]
        });

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        res.json({ delivery });
    } catch (error) {
        console.error('Get delivery error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery' });
    }
};

// ============================================
// GET DELIVERY BY ORDER
// ============================================
exports.getDeliveryByOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const delivery = await Delivery.findOne({ 
            where: { order_id },
            include: [
                { model: User, as: 'driver', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
                { model: Store, as: 'vendor', attributes: ['id', 'store_name'] }
            ]
        });

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        res.json({ delivery });
    } catch (error) {
        console.error('Get delivery by order error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery' });
    }
};

// ============================================
// UPDATE DELIVERY STATUS (Driver)
// ============================================
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, proof_image, signature, driver_notes } = req.body;
        const driver_id = req.user.id;

        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        if (delivery.driver_id !== driver_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not assigned to this delivery' });
        }

        const updates = { status };
        
        switch (status) {
            case 'picked_up':
                updates.pickup_time = new Date();
                break;
            case 'in_transit':
                // No time update needed
                break;
            case 'delivered':
                updates.delivery_time = new Date();
                updates.completed_at = new Date();
                if (proof_image) updates.proof_image = proof_image;
                if (signature) updates.signature = signature;
                break;
            case 'failed':
            case 'cancelled':
                updates.delivery_time = new Date();
                break;
        }

        if (driver_notes) updates.driver_notes = driver_notes;

        await delivery.update(updates);

        // Update order status
        const order = await Order.findByPk(delivery.order_id);
        if (order) {
            const orderStatusMap = {
                'picked_up': 'processing',
                'in_transit': 'processing',
                'delivered': 'delivered',
                'failed': 'cancelled',
                'cancelled': 'cancelled'
            };
            if (orderStatusMap[status]) {
                await order.update({ delivery_status: status });
                if (status === 'delivered') {
                    await order.update({ status: 'delivered', delivered_at: new Date() });
                }
            }
        }

        // ✅ NOTIFICATION: Based on status
        const statusMessages = {
            'picked_up': { title: '📦 Order Picked Up', message: `Driver has picked up your order #${order?.order_number}` },
            'in_transit': { title: '🚚 Order In Transit', message: `Your order #${order?.order_number} is on the way` },
            'delivered': { title: '✅ Order Delivered', message: `Order #${order?.order_number} has been delivered` },
            'failed': { title: '❌ Delivery Failed', message: `Delivery for order #${order?.order_number} has failed` },
            'cancelled': { title: '🚫 Delivery Cancelled', message: `Delivery for order #${order?.order_number} was cancelled` }
        };

        const statusData = statusMessages[status];
        if (statusData && order) {
            // Notify customer
            await createNotification(
                order.customer_id,
                status === 'delivered' ? 'delivery_delivered' : 'delivery_in_transit',
                statusData.title,
                statusData.message,
                { 
                    order_id: order.id, 
                    order_number: order.order_number,
                    delivery_id: delivery.id,
                    status: status
                },
                `/dashboard/orders/${order.id}`
            );
        }

        res.json({
            message: 'Delivery status updated',
            delivery
        });

    } catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
};

// ============================================
// VERIFY DELIVERY CODE - DRIVER ENTERS CODE
// ============================================
exports.verifyDeliveryCode = async (req, res) => {
    try {
        const { order_id, code } = req.body;
        const driver_id = req.user.id;

        if (!order_id || !code) {
            return res.status(400).json({ error: 'Order ID and code are required' });
        }

        // Find order
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Find delivery
        const delivery = await Delivery.findOne({ where: { order_id } });
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found for this order' });
        }

        // Check if driver is assigned to this delivery
        if (delivery.driver_id !== driver_id) {
            return res.status(403).json({ error: 'You are not assigned to this delivery' });
        }

        // Check if code already verified
        if (order.is_delivery_code_verified) {
            return res.status(400).json({ error: 'Code already verified for this order' });
        }

        // Check if code expired
        if (new Date() > order.delivery_code_expires) {
            return res.status(400).json({ error: 'Delivery code has expired. Contact support.' });
        }

        // Check attempts (max 3)
        if (order.delivery_code_attempts >= 3) {
            return res.status(400).json({ 
                error: 'Too many failed attempts. Order locked. Contact support.' 
            });
        }

        // Verify code
        if (order.delivery_code !== code) {
            order.delivery_code_attempts += 1;
            await order.save();
            
            // Update delivery code attempts
            await delivery.update({ code_attempts: order.delivery_code_attempts });
            
            const remaining = 3 - order.delivery_code_attempts;
            return res.status(400).json({ 
                error: `Invalid code. ${remaining} attempt(s) remaining.` 
            });
        }

        // ✅ CODE VERIFIED SUCCESSFULLY
        order.is_delivery_code_verified = true;
        order.status = 'delivered';
        order.delivered_at = new Date();
        order.delivery_status = 'delivered';
        await order.save();

        // Update delivery record
        await delivery.update({ 
            status: 'delivered', 
            completed_at: new Date(),
            delivery_time: new Date(),
            code_verified_at: new Date(),
            code_attempts: order.delivery_code_attempts
        });

        // ============================================
        // RELEASE ESCROW TO VENDOR
        // ============================================
        if (order.escrow_status === 'held') {
            // Get store to find vendor
            const store = await Store.findByPk(order.store_id);
            if (store) {
                const wallet = await Wallet.findOne({ where: { user_id: store.vendor_id } });
                if (wallet) {
                    wallet.balance = parseFloat(wallet.balance) + parseFloat(order.escrow_amount);
                    wallet.total_earned = parseFloat(wallet.total_earned) + parseFloat(order.escrow_amount);
                    await wallet.save();
                    console.log(`💰 Escrow released: KES ${order.escrow_amount} to vendor ${store.vendor_id}`);
                }
            }

            order.escrow_status = 'released';
            order.escrow_released_at = new Date();
            order.payment_status = 'paid';
            await order.save();

            // Update delivery escrow status
            await delivery.update({ 
                escrow_released: true, 
                escrow_released_at: new Date() 
            });

            // ✅ NOTIFICATION: Escrow released to vendor
            if (store?.vendor_id) {
                await createNotification(
                    store.vendor_id,
                    'escrow_released',
                    '💰 Payment Released',
                    `Payment of KES ${order.escrow_amount} for order #${order.order_number} has been released to your wallet`,
                    { 
                        order_id: order.id, 
                        order_number: order.order_number,
                        amount: order.escrow_amount,
                        delivery_id: delivery.id
                    },
                    `/vendor/wallet`
                );
            }
        }

        // ✅ NOTIFICATION: Delivery complete to customer
        await createNotification(
            order.customer_id,
            'delivery_delivered',
            '✅ Delivery Complete',
            `Your order #${order.order_number} has been delivered successfully!`,
            { 
                order_id: order.id, 
                order_number: order.order_number,
                delivery_id: delivery.id
            },
            `/dashboard/orders/${order.id}`
        );

        res.json({
            message: '✅ Delivery verified successfully!',
            order_id: order.id,
            order_number: order.order_number,
            status: order.status,
            escrow_released: true,
            escrow_amount: order.escrow_amount
        });

    } catch (error) {
        console.error('Verify delivery code error:', error);
        res.status(500).json({ error: 'Failed to verify delivery code' });
    }
};

// ============================================
// RESEND DELIVERY CODE TO CUSTOMER
// ============================================
exports.resendDeliveryCode = async (req, res) => {
    try {
        const { order_id } = req.body;
        const customer_id = req.user.id;

        const order = await Order.findOne({
            where: { id: order_id, customer_id }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.is_delivery_code_verified) {
            return res.status(400).json({ error: 'Code already verified' });
        }

        // Generate new code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Update order with new code and reset attempts
        order.delivery_code = newCode;
        order.delivery_code_attempts = 0;
        order.delivery_code_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await order.save();

        // Update delivery
        const delivery = await Delivery.findOne({ where: { order_id } });
        if (delivery) {
            await delivery.update({ 
                delivery_code: newCode,
                code_attempts: 0 
            });
        }

        // Send new code to customer
        await sendDeliveryCodeToCustomer(customer_id, order.order_number, newCode);

        res.json({
            message: 'New delivery code sent to your phone and email',
            order_id: order.id
        });

    } catch (error) {
        console.error('Resend delivery code error:', error);
        res.status(500).json({ error: 'Failed to resend delivery code' });
    }
};

// ============================================
// ============================================
// GET DRIVER DELIVERIES
// ============================================
exports.getDriverDeliveries = async (req, res) => {
    try {
        const driver_id = req.user.id;

        const deliveries = await Delivery.findAll({
            where: { driver_id },
            include: [
                {
                    model: Order,
                    as: 'order',
                    attributes: ['id', 'order_number', 'total', 'status', 'delivery_address', 'customer_id']
                },
                {
                    model: User,
                    as: 'driver',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ deliveries });
    } catch (error) {
        console.error('Get driver deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
};

// ============================================
// ASSIGN DRIVER TO DELIVERY (Vendor/Admin)
// ============================================
exports.assignDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driver_id } = req.body;

        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        const order = await Order.findByPk(delivery.order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await delivery.update({ 
            driver_id, 
            status: 'assigned' 
        });

        // ✅ NOTIFICATION: To driver
        const driver = await User.findByPk(driver_id);
        if (driver) {
            await createNotification(
                driver_id,
                'delivery_assigned',
                '🚚 New Delivery Assigned',
                `You have been assigned a delivery for order #${order.order_number}`,
                { 
                    order_id: order.id, 
                    order_number: order.order_number,
                    delivery_id: delivery.id,
                    delivery_address: delivery.delivery_address,
                    delivery_fee: delivery.delivery_fee
                },
                `/driver/deliveries/${delivery.id}`
            );
        }

        res.json({
            message: 'Driver assigned successfully',
            delivery
        });

    } catch (error) {
        console.error('Assign driver error:', error);
        res.status(500).json({ error: 'Failed to assign driver' });
    }
};

// ============================================
// GET PENDING DELIVERIES (For Vendor)
// ============================================
exports.getPendingDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll({
            where: { status: 'assigned' },
            include: [
                { 
                    model: Order, 
                    as: 'order',
                    attributes: ['id', 'order_number', 'total', 'customer_id', 'delivery_address']
                },
                { 
                    model: Store, 
                    as: 'vendor',
                    attributes: ['id', 'store_name']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        res.json({ deliveries });
    } catch (error) {
        console.error('Get pending deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch pending deliveries' });
    }
};

// ============================================
// GET AVAILABLE DRIVERS (For Vendor)
// ============================================
exports.getAvailableDrivers = async (req, res) => {
    try {
        const drivers = await User.findAll({
            where: { 
                role: 'driver',
                is_active: true
            },
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
            include: [
                {
                    model: Driver,
                    as: 'driverProfile',
                    where: { is_available: true }
                }
            ]
        });

        res.json({ drivers });
    } catch (error) {
        console.error('Get available drivers error:', error);
        res.status(500).json({ error: 'Failed to fetch available drivers' });
    }
};

// ============================================
// VENDOR DELIVERIES
// ============================================
exports.getVendorDeliveries = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find vendor's store
        const store = await Store.findOne({ where: { vendor_id: userId } });
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const deliveries = await Delivery.findAll({
            where: { vendor_id: store.id },
            include: [
                { 
                    model: Order, 
                    as: 'order',
                    attributes: ['id', 'order_number', 'total', 'customer_id', 'delivery_address']
                },
                { 
                    model: User, 
                    as: 'driver',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ deliveries });
    } catch (error) {
        console.error('Get vendor deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor deliveries' });
    }
};

// ============================================
// ADMIN: GET ALL DELIVERIES (System-wide)
// ============================================
exports.getAllDeliveries = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;

        const deliveries = await Delivery.findAndCountAll({
            where,
            include: [
                { model: Order, as: 'order', attributes: ['id', 'order_number', 'total', 'status'] },
                { model: User, as: 'driver', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
                { model: Store, as: 'vendor', attributes: ['id', 'store_name'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            total: deliveries.count,
            pages: Math.ceil(deliveries.count / limit),
            current_page: parseInt(page),
            deliveries: deliveries.rows
        });

    } catch (error) {
        console.error('❌ Get all deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch deliveries', details: error.message });
    }
};

// ============================================
// ADMIN: GET ALL DRIVERS
// ============================================
exports.getAllDrivers = async (req, res) => {
    try {
        const { is_available, is_verified, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (is_available !== undefined) where.is_available = is_available === 'true';
        if (is_verified !== undefined) where.is_verified = is_verified === 'true';

        const drivers = await Driver.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            total: drivers.count,
            pages: Math.ceil(drivers.count / limit),
            current_page: parseInt(page),
            drivers: drivers.rows
        });

    } catch (error) {
        console.error('❌ Get all drivers error:', error);
        res.status(500).json({ error: 'Failed to fetch drivers', details: error.message });
    }
};

// ============================================
// ADMIN: VERIFY DRIVER
// ============================================
exports.verifyDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_verified } = req.body;

        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ success: false, error: 'Driver not found' });
        }

        await driver.update({ is_verified: is_verified });

        // ✅ Notify driver
        await createNotification(
            driver.user_id,
            is_verified ? 'success' : 'warning',
            is_verified ? '✅ Driver Verified' : '❌ Driver Verification Failed',
            is_verified 
                ? 'Your driver account has been verified. You can now accept deliveries.'
                : 'Your driver account verification was not approved. Please contact support.',
            { driver_id: driver.id },
            '/driver/profile'
        );

        res.json({
            success: true,
            message: `Driver ${is_verified ? 'verified' : 'unverified'} successfully`,
            driver: {
                id: driver.id,
                user_id: driver.user_id,
                is_verified: driver.is_verified,
                is_available: driver.is_available
            }
        });

    } catch (error) {
        console.error('❌ Verify driver error:', error);
        res.status(500).json({ error: 'Failed to verify driver', details: error.message });
    }
};

// ============================================
// ADMIN: DELETE DRIVER
// ============================================
exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ success: false, error: 'Driver not found' });
        }

        await driver.destroy();

        res.json({
            success: true,
            message: 'Driver deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete driver error:', error);
        res.status(500).json({ error: 'Failed to delete driver', details: error.message });
    }
};

// ============================================
// GET DELIVERY STATUS
// ============================================
exports.getDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await Delivery.findByPk(id, {
            attributes: ['id', 'status', 'pickup_time', 'delivery_time', 'completed_at', 'delivery_code', 'code_verified_at']
        });

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        res.json({
            success: true,
            delivery: {
                id: delivery.id,
                status: delivery.status,
                pickup_time: delivery.pickup_time,
                delivery_time: delivery.delivery_time,
                completed_at: delivery.completed_at,
                code_verified_at: delivery.code_verified_at
            }
        });

    } catch (error) {
        console.error('❌ Get delivery status error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery status', details: error.message });
    }
};

// ============================================
// CUSTOMER: GET CUSTOMER DELIVERIES
// ============================================
exports.getCustomerDeliveries = async (req, res) => {
    try {
        const customer_id = req.user.id;

        // Find orders for this customer
        const orders = await Order.findAll({
            where: { customer_id },
            attributes: ['id', 'order_number', 'status', 'delivery_status', 'total', 'created_at', 'delivered_at'],
            include: [
                {
                    model: Delivery,
                    as: 'delivery',
                    attributes: ['id', 'status', 'delivery_address', 'delivery_fee', 'pickup_time', 'delivery_time', 'driver_id'],
                    include: [
                        {
                            model: User,
                            as: 'driver',
                            attributes: ['id', 'first_name', 'last_name', 'phone']
                        }
                    ]
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'store_name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('❌ Get customer deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch customer deliveries', details: error.message });
    }
};

// ============================================
// GET ESCROW STATUS
// ============================================
exports.getEscrowStatus = async (req, res) => {
    try {
        const { order_id } = req.params;

        const order = await Order.findByPk(order_id, {
            attributes: ['id', 'order_number', 'escrow_amount', 'escrow_status', 'escrow_released_at', 'total', 'status']
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user is authorized (customer or vendor)
        const userId = req.user.id;
        const store = await Store.findOne({ where: { vendor_id: userId } });
        const isVendor = store && store.id === order.store_id;
        const isCustomer = order.customer_id === userId;

        if (!isVendor && !isCustomer && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to view escrow status' });
        }

        res.json({
            success: true,
            escrow: {
                order_id: order.id,
                order_number: order.order_number,
                amount: order.escrow_amount || order.total,
                status: order.escrow_status || 'pending',
                released_at: order.escrow_released_at
            }
        });

    } catch (error) {
        console.error('❌ Get escrow status error:', error);
        res.status(500).json({ error: 'Failed to fetch escrow status', details: error.message });
    }
};

// ============================================
// ADMIN: MANUAL ESCROW RELEASE (Emergency)
// ============================================
exports.manualReleaseEscrow = async (req, res) => {
    try {
        const { order_id } = req.params;

        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.escrow_status === 'released') {
            return res.status(400).json({ error: 'Escrow already released' });
        }

        // Get store to find vendor
        const store = await Store.findByPk(order.store_id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Release escrow to vendor
        const wallet = await Wallet.findOne({ where: { user_id: store.vendor_id } });
        if (wallet) {
            const amount = parseFloat(order.escrow_amount) || parseFloat(order.total);
            wallet.balance = parseFloat(wallet.balance) + amount;
            wallet.total_earned = parseFloat(wallet.total_earned) + amount;
            await wallet.save();
        }

        order.escrow_status = 'released';
        order.escrow_released_at = new Date();
        order.payment_status = 'paid';
        await order.save();

        // Update delivery
        const delivery = await Delivery.findOne({ where: { order_id } });
        if (delivery) {
            await delivery.update({
                escrow_released: true,
                escrow_released_at: new Date()
            });
        }

        res.json({
            success: true,
            message: 'Escrow released manually by admin',
            order: {
                id: order.id,
                escrow_status: order.escrow_status,
                escrow_released_at: order.escrow_released_at
            }
        });

    } catch (error) {
        console.error('❌ Manual escrow release error:', error);
        res.status(500).json({ error: 'Failed to release escrow', details: error.message });
    }
};

// ============================================
// ADMIN: LIVE UPDATES (Real-time Dashboard)
// ============================================
exports.getLiveUpdates = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get recent deliveries
        const recentDeliveries = await Delivery.findAll({
            limit,
            order: [['updated_at', 'DESC']],
            include: [
                { model: Order, as: 'order', attributes: ['order_number', 'total'] },
                { model: User, as: 'driver', attributes: ['first_name', 'last_name'] },
                { model: Store, as: 'vendor', attributes: ['store_name'] }
            ]
        });

        // Get recent orders
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, as: 'customer', attributes: ['first_name', 'last_name'] },
                { model: Store, as: 'store', attributes: ['store_name'] }
            ]
        });

        res.json({
            success: true,
            deliveries: recentDeliveries,
            orders: recentOrders,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Get live updates error:', error);
        res.status(500).json({ error: 'Failed to fetch live updates', details: error.message });
    }
};

// ============================================
// ADMIN: DELIVERY STATISTICS
// ============================================
exports.getDeliveryStats = async (req, res) => {
    try {
        const totalDeliveries = await Delivery.count();
        const assigned = await Delivery.count({ where: { status: 'assigned' } });
        const pickedUp = await Delivery.count({ where: { status: 'picked_up' } });
        const inTransit = await Delivery.count({ where: { status: 'in_transit' } });
        const delivered = await Delivery.count({ where: { status: 'delivered' } });
        const failed = await Delivery.count({ where: { status: ['failed', 'cancelled'] } });

        // Get today's deliveries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDeliveries = await Delivery.count({
            where: {
                created_at: { [Op.gte]: today }
            }
        });

        // Get average delivery time
        const completedDeliveries = await Delivery.findAll({
            where: { status: 'delivered' },
            attributes: ['created_at', 'delivery_time']
        });

        let avgTime = 0;
        if (completedDeliveries.length > 0) {
            let totalMinutes = 0;
            completedDeliveries.forEach(d => {
                if (d.delivery_time && d.created_at) {
                    const minutes = (new Date(d.delivery_time) - new Date(d.created_at)) / 60000;
                    totalMinutes += minutes;
                }
            });
            avgTime = Math.round(totalMinutes / completedDeliveries.length);
        }

        res.json({
            success: true,
            stats: {
                total: totalDeliveries,
                assigned,
                pickedUp,
                inTransit,
                delivered,
                failed,
                today: todayDeliveries,
                averageDeliveryTime: avgTime,
                completionRate: totalDeliveries > 0 ? Math.round((delivered / totalDeliveries) * 100) : 0
            }
        });

    } catch (error) {
        console.error('❌ Get delivery stats error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery stats', details: error.message });
    }
};