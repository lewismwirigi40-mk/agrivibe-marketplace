const Order = require('../models/Order.cjs');
const Cart = require('../models/Cart.cjs');
const Product = require('../models/Product.cjs');
const Store = require('../models/Store.cjs');
const User = require('../models/User.cjs');
const Wallet = require('../models/Wallet.cjs');
const { Op } = require('sequelize');

// Generate Order Number
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
}

// Generate 6-digit delivery code
function generateDeliveryCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create Order (Checkout)
exports.createOrder = async (req, res) => {
    try {
        const { delivery_address, delivery_notes, payment_method } = req.body;
        const customer_id = req.user.id;

        // Get cart items
        const cartItems = await Cart.findAll({
            where: { user_id: customer_id },
            include: [Product]
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Check stock and calculate totals
        let subtotal = 0;
        let store_id = null;
        const orderItems = [];

        for (const item of cartItems) {
            if (!store_id) {
                store_id = item.Product.store_id;
            }

            if (item.Product.stock_quantity < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${item.Product.name}`
                });
            }

            const itemTotal = parseFloat(item.price) * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal,
                product_name: item.Product.name
            });
        }

        // Calculate totals
        const delivery_fee = 0;
        const tax = 0;
        const discount = 0;
        const total = subtotal + delivery_fee + tax - discount;

        // Generate order number
        const order_number = generateOrderNumber();

        // Generate delivery code
        const deliveryCode = generateDeliveryCode();

        // Set code expiry (24 hours from now)
        const codeExpiry = new Date();
        codeExpiry.setHours(codeExpiry.getHours() + 24);

        // ============================================
        // ESCROW - Hold payment amount
        // ============================================
        const escrow_amount = total;
        const escrow_status = 'held';

        // Create order
        const order = await Order.create({
            order_number,
            customer_id,
            store_id,
            status: 'pending',
            payment_status: 'unpaid',
            delivery_status: 'pending',
            subtotal,
            delivery_fee,
            tax,
            discount,
            total,
            delivery_address,
            delivery_notes,
            payment_method,
            // Delivery code fields
            delivery_code: deliveryCode,
            delivery_code_expires: codeExpiry,
            delivery_code_attempts: 0,
            is_delivery_code_verified: false,
            // Escrow fields
            escrow_amount: total,
            escrow_status: 'held'
        });

        // Update product stock
        for (const item of cartItems) {
            const product = await Product.findByPk(item.product_id);
            product.stock_quantity -= item.quantity;
            product.sales_count += item.quantity;
            await product.save();
        }

        // Clear cart
        await Cart.destroy({ where: { user_id: customer_id } });

        // Send delivery code to customer ONLY
        await sendDeliveryCodeToCustomer(customer_id, order_number, deliveryCode);

        res.status(201).json({
            message: 'Order created successfully',
            order,
            items: orderItems,
            delivery_code: deliveryCode,
            escrow: {
                amount: total,
                status: 'held'
            }
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Send delivery code to customer only
async function sendDeliveryCodeToCustomer(customerId, orderNumber, code) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) return;

        const message = `🔑 Your AgriVibe delivery code for order #${orderNumber} is: ${code}

Please keep this code safe. Give it to your driver only when you receive your items.

Thank you for choosing AgriVibe! 🌾`;

        if (customer.phone) {
            console.log(`📱 SMS sent to ${customer.phone}: ${message}`);
        }

        if (customer.email) {
            console.log(`📧 Email sent to ${customer.email}: ${message}`);
        }

        console.log(`🔑 Delivery code for order #${orderNumber}: ${code}`);

    } catch (error) {
        console.error('Send delivery code error:', error);
    }
}

// Get All Orders (Customer)
exports.getMyOrders = async (req, res) => {
    try {
        const customer_id = req.user.id;

        const orders = await Order.findAll({
            where: { customer_id },
            order: [['created_at', 'DESC']]
        });

        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer_id = req.user.id;

        const order = await Order.findOne({
            where: { id, customer_id }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Get Vendor Orders (Vendor)
exports.getVendorOrders = async (req, res) => {
    try {
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const orders = await Order.findAll({
            where: { store_id: store.id },
            order: [['created_at', 'DESC']]
        });

        res.json({ orders });
    } catch (error) {
        console.error('Get vendor orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Update Order Status (Vendor/Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.update({ status });

        res.json({
            message: 'Order status updated',
            order
        });

    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Cancel Order (Customer) - WITH ESCROW REFUND
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const customer_id = req.user.id;

        const order = await Order.findOne({
            where: { id, customer_id }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.status === 'delivered' || order.status === 'shipped') {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }

        // ============================================
        // ESCROW REFUND - Return money to customer
        // ============================================
        if (order.escrow_status === 'held') {
            order.escrow_status = 'refunded';
            order.escrow_refunded_at = new Date();
            await order.save();

            // Refund to customer wallet
            const wallet = await Wallet.findOne({ where: { user_id: customer_id } });
            if (wallet) {
                wallet.balance = parseFloat(wallet.balance) + parseFloat(order.escrow_amount);
                await wallet.save();
                console.log(`💰 Escrow refunded: KES ${order.escrow_amount} to customer ${customer_id}`);
            }
        }

        await order.update({ 
            status: 'cancelled', 
            cancelled_at: new Date(),
            cancel_reason: req.body.cancel_reason || 'Cancelled by customer'
        });

        res.json({
            message: 'Order cancelled successfully. Refund processed.',
            order
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
};

// ============================================
// RELEASE ESCROW (Called when delivery is verified)
// ============================================
exports.releaseEscrow = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.escrow_status !== 'held') {
            return res.status(400).json({ error: 'Escrow not in held status' });
        }

        // Release escrow to vendor
        const store = await Store.findByPk(order.store_id);
        if (store) {
            const wallet = await Wallet.findOne({ where: { user_id: store.vendor_id } });
            if (wallet) {
                wallet.balance = parseFloat(wallet.balance) + parseFloat(order.escrow_amount);
                wallet.total_earned = parseFloat(wallet.total_earned) + parseFloat(order.escrow_amount);
                await wallet.save();
            }
        }

        order.escrow_status = 'released';
        order.escrow_released_at = new Date();
        order.payment_status = 'paid';
        await order.save();

        res.json({
            message: 'Escrow released successfully',
            order
        });

    } catch (error) {
        console.error('Release escrow error:', error);
        res.status(500).json({ error: 'Failed to release escrow' });
    }
};

// ============================================
// GET ESCROW STATUS
// ============================================
exports.getEscrowStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const customer_id = req.user.id;

        const order = await Order.findOne({
            where: { id, customer_id },
            attributes: ['id', 'escrow_amount', 'escrow_status', 'escrow_released_at', 'escrow_refunded_at']
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ escrow: order });
    } catch (error) {
        console.error('Get escrow status error:', error);
        res.status(500).json({ error: 'Failed to fetch escrow status' });
    }
};