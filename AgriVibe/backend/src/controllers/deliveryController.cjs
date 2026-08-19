const Delivery = require('../models/Delivery.cjs');
const Order = require('../models/Order.cjs');
const Store = require('../models/Store.cjs');
const User = require('../models/User.cjs');
const Wallet = require('../models/Wallet.cjs');
const { Op } = require('sequelize');

// Create Delivery (Admin/Vendor)
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

        const delivery = await Delivery.create({
            order_id,
            driver_id,
            pickup_address,
            delivery_address,
            pickup_lat,
            pickup_lng,
            delivery_lat,
            delivery_lng,
            delivery_fee: delivery_fee || 0,
            estimated_time,
            customer_notes,
            status: 'assigned'
        });

        await order.update({ delivery_status: 'assigned' });

        res.status(201).json({
            message: 'Delivery created successfully',
            delivery
        });

    } catch (error) {
        console.error('Create delivery error:', error);
        res.status(500).json({ error: 'Failed to create delivery' });
    }
};

// Get Delivery by ID
exports.getDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;
        const delivery = await Delivery.findByPk(id);

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        res.json({ delivery });
    } catch (error) {
        console.error('Get delivery error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery' });
    }
};

// Get Delivery by Order
exports.getDeliveryByOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const delivery = await Delivery.findOne({ where: { order_id } });

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        res.json({ delivery });
    } catch (error) {
        console.error('Get delivery by order error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery' });
    }
};

// Update Delivery Status (Driver)
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
        await Delivery.update(
            { 
                status: 'delivered', 
                completed_at: new Date(),
                delivery_time: new Date()
            },
            { where: { order_id: order.id } }
        );

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
        }

        // Send notifications
        await notifyCustomerDeliveryComplete(order.customer_id, order.order_number);
        await notifyVendorDeliveryComplete(order.store_id, order.order_number);

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
// HELPER FUNCTIONS
// ============================================

// Send delivery code to customer
async function sendDeliveryCodeToCustomer(customerId, orderNumber, code) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) return;

        const message = `🔑 Your AgriVibe delivery code for order #${orderNumber} is: ${code}\n\nGive this code to your driver only when you receive your items.\n\nThank you for choosing AgriVibe! 🌾`;

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

// Notify customer delivery complete
async function notifyCustomerDeliveryComplete(customerId, orderNumber) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) return;

        const message = `📦 Order #${orderNumber} has been delivered!\n\nThank you for shopping with AgriVibe! 🌾`;

        console.log(`📱 Delivery complete notification sent to ${customer.email}: ${message}`);

    } catch (error) {
        console.error('Notify customer error:', error);
    }
}

// Notify vendor delivery complete
async function notifyVendorDeliveryComplete(storeId, orderNumber) {
    try {
        const store = await Store.findByPk(storeId);
        if (!store) return;

        const vendor = await User.findByPk(store.vendor_id);
        if (!vendor) return;

        const message = `📦 Order #${orderNumber} has been delivered!\n\nPayment has been released to your wallet.`;

        console.log(`📱 Vendor notification sent to ${vendor.email}: ${message}`);

    } catch (error) {
        console.error('Notify vendor error:', error);
    }
}

// ============================================
// DRIVER DELIVERY ROUTES
// ============================================

// Get Driver Deliveries
exports.getDriverDeliveries = async (req, res) => {
    try {
        const driver_id = req.user.id;

        const deliveries = await Delivery.findAll({
            where: { driver_id },
            order: [['created_at', 'DESC']]
        });

        res.json({ deliveries });
    } catch (error) {
        console.error('Get driver deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
};

// Assign Driver to Delivery (Admin/Vendor)
exports.assignDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driver_id } = req.body;

        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        await delivery.update({ driver_id, status: 'assigned' });

        res.json({
            message: 'Driver assigned successfully',
            delivery
        });

    } catch (error) {
        console.error('Assign driver error:', error);
        res.status(500).json({ error: 'Failed to assign driver' });
    }
};

// Get Pending Deliveries
exports.getPendingDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll({
            where: { status: 'assigned' },
            order: [['created_at', 'ASC']]
        });

        res.json({ deliveries });
    } catch (error) {
        console.error('Get pending deliveries error:', error);
        res.status(500).json({ error: 'Failed to fetch pending deliveries' });
    }
};