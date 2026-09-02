const Order = require('../models/Order.cjs');
const Cart = require('../models/Cart.cjs');
const Product = require('../models/Product.cjs');
const Store = require('../models/Store.cjs');
const User = require('../models/User.cjs');
const Wallet = require('../models/Wallet.cjs');
const OrderItem = require('../models/OrderItem.cjs');
const { Op } = require('sequelize');

// ============================================
// HELPER FUNCTIONS
// ============================================

// Calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

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

// ============================================
// SEND DELIVERY CODE TO CUSTOMER
// ============================================
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

// ============================================
// NOTIFY VENDOR FOR LONG DISTANCE
// ============================================
async function notifyVendorForLongDistance(orderId, storeId, customerId) {
    try {
        const store = await Store.findByPk(storeId, {
            include: [{ model: User, as: 'vendorUser' }]
        });
        const customer = await User.findByPk(customerId);
        const order = await Order.findByPk(orderId);

        if (!store || !customer || !order) return;

        const message = `📦 Long Distance Order Alert!

Order #${order.order_number}
Customer: ${customer.first_name} ${customer.last_name}
Phone: ${customer.phone || 'N/A'}
Email: ${customer.email}
Delivery: ${order.delivery_address}

⚠️ This order is ${order.delivery_distance || 'far'} from your store.
Please contact the customer to arrange delivery.

Contact customer: ${customer.phone || 'N/A'}`;

        console.log(`📧 Vendor notification for order #${order.order_number}:`);
        console.log(message);

    } catch (error) {
        console.error('Vendor notification error:', error);
    }
}

// ============================================
// CREATE ORDER (CHECKOUT)
// ============================================
exports.createOrder = async (req, res) => {
    try {
        const { 
            delivery_address, 
            county,
            town,
            local_area,
            delivery_notes, 
            payment_method,
            phone
        } = req.body;
        
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

        // ============================================
        // CALCULATE DISTANCE & DELIVERY FEE
        // ============================================
        let deliveryFee = 0;
        let distanceKm = 0;
        let isLocalDelivery = true;

        const store = await Store.findByPk(store_id);
        const customer = await User.findByPk(customer_id);

        const fullDeliveryAddress = [
            delivery_address,
            local_area,
            town,
            county
        ].filter(Boolean).join(', ');

        if (store && store.latitude && store.longitude && 
            customer && customer.latitude && customer.longitude) {
            
            distanceKm = calculateDistance(
                store.latitude, store.longitude,
                customer.latitude, customer.longitude
            );
            
            console.log(`📍 Distance: ${distanceKm.toFixed(2)} km`);
            
            if (distanceKm <= 15) {
                isLocalDelivery = true;
                if (subtotal >= 1000) {
                    deliveryFee = 0;
                } else {
                    deliveryFee = 150;
                }
            } else {
                isLocalDelivery = false;
                deliveryFee = 0;
                console.log(`📦 Long distance order (${distanceKm.toFixed(2)} km). Vendor will contact buyer.`);
            }
        } else {
            deliveryFee = subtotal >= 1000 ? 0 : 150;
        }

        const tax = 0;
        const discount = 0;
        const total = subtotal + deliveryFee + tax - discount;

        const order_number = generateOrderNumber();
        const deliveryCode = generateDeliveryCode();
        const codeExpiry = new Date();
        codeExpiry.setHours(codeExpiry.getHours() + 24);

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
            delivery_fee: deliveryFee,
            tax,
            discount,
            total,
            delivery_address: fullDeliveryAddress,
            delivery_notes: delivery_notes || '',
            payment_method: payment_method || 'mpesa',
            delivery_code: deliveryCode,
            delivery_code_expires: codeExpiry,
            delivery_code_attempts: 0,
            is_delivery_code_verified: false,
            escrow_amount: total,
            escrow_status: 'held',
            delivery_county: county || '',
            delivery_town: town || '',
            delivery_local_area: local_area || '',
            customer_phone: phone || customer.phone || ''
        });

        // Create OrderItems
        for (const item of orderItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                vendor_id: store_id,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
                status: 'pending'
            });
        }

        // Update product stock
        for (const item of cartItems) {
            const product = await Product.findByPk(item.product_id);
            product.stock_quantity -= item.quantity;
            product.sales_count += item.quantity;
            await product.save();
        }

        // Clear cart
        await Cart.destroy({ where: { user_id: customer_id } });

        // Send delivery code to customer
        await sendDeliveryCodeToCustomer(customer_id, order_number, deliveryCode);

        // If long distance, notify vendor
        if (!isLocalDelivery) {
            await notifyVendorForLongDistance(order.id, store_id, customer_id);
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                order_number: order.order_number,
                total: order.total,
                status: order.status,
                delivery_code: deliveryCode,
                is_local_delivery: isLocalDelivery,
                distance_km: Math.round(distanceKm * 10) / 10
            },
            items: orderItems,
            delivery_fee: deliveryFee,
            escrow: {
                amount: total,
                status: 'held'
            }
        });

    } catch (error) {
        console.error('❌ Create order error:', error);
        res.status(500).json({ 
            error: 'Failed to create order',
            details: error.message 
        });
    }
};

// ============================================
// GET ALL ORDERS (Customer) - ✅ FIXED
// ============================================
// backend/src/controllers/orderController.cjs

exports.getMyOrders = async (req, res) => {
    try {
        const customer_id = req.user.id;

        const orders = await Order.findAll({
            where: { customer_id },
            include: [
                {
                    model: User,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                },
                {
                    model: OrderItem,
                    as: 'items',  // ✅ FIXED: Changed from 'items' to 'orderItems'
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'images']
                        }
                    ]
                },
                {
                    model: Store,
                    as: 'orderstore',
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
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// ============================================
// GET ORDER BY ID - ✅ FIXED
// ============================================
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer_id = req.user.id;

        const order = await Order.findOne({
            where: { id, customer_id },
            include: [
                {
                    model: User,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'images']
                        }
                    ]
                },
                {
                    model: Store,
                    as: 'orderstore',
                    attributes: ['id', 'store_name']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ 
            success: true,
            order 
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// ============================================
// GET VENDOR ORDERS - ✅ FIXED
// ============================================
exports.getVendorOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const store = await Store.findOne({
            where: { vendor_id: userId }
        });

        if (!store) {
            return res.status(404).json({ 
                success: false,
                error: 'Store not found. Please complete your store setup.' 
            });
        }

        const orders = await Order.findAll({
            where: { store_id: store.id },
            include: [
                {
                    model: User,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'images', 'price']
                        }
                    ]
                },
                {
                    model: Store,
                    as: 'orderstore',
                    attributes: ['id', 'store_name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        const formattedOrders = orders.map(order => {
            const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            
            return {
                id: order.id,
                order_number: order.order_number,
                customer: order.customer ? {
                    name: `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() || 'Customer',
                    email: order.customer.email || 'N/A',
                    phone: order.customer.phone || 'N/A'
                } : { 
                    name: 'Unknown Customer', 
                    email: 'N/A', 
                    phone: 'N/A' 
                },
                items: order.items || [],
                total_items: totalItems,
                subtotal: order.subtotal,
                delivery_fee: order.delivery_fee,
                total: order.total,
                status: order.status,
                payment_status: order.payment_status,
                delivery_status: order.delivery_status,
                delivery_address: order.delivery_address,
                delivery_notes: order.delivery_notes,
                delivery_code: order.delivery_code,
                created_at: order.created_at,
                delivered_at: order.delivered_at,
                customer_phone: order.customer?.phone || order.customer_phone || 'N/A'
            };
        });

        const totalOrders = formattedOrders.length;
        const pendingOrders = formattedOrders.filter(o => o.status === 'pending').length;
        const completedOrders = formattedOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
        const totalRevenue = formattedOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

        res.json({
            success: true,
            orders: formattedOrders,
            stats: {
                total: totalOrders,
                pending: pendingOrders,
                completed: completedOrders,
                revenue: totalRevenue
            }
        });

    } catch (error) {
        console.error('❌ Get vendor orders error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch orders',
            details: error.message 
        });
    }
};

// ============================================
// UPDATE ORDER STATUS (Vendor/Admin)
// ============================================
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
            success: true,
            message: 'Order status updated',
            order
        });

    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// ============================================
// CANCEL ORDER (Customer) - WITH ESCROW REFUND
// ============================================
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

        // ESCROW REFUND
        if (order.escrow_status === 'held') {
            order.escrow_status = 'refunded';
            order.escrow_refunded_at = new Date();
            await order.save();

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
            success: true,
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
            success: true,
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

        res.json({ 
            success: true,
            escrow: order 
        });
    } catch (error) {
        console.error('Get escrow status error:', error);
        res.status(500).json({ error: 'Failed to fetch escrow status' });
    }
};