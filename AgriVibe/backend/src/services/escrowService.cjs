const Order = require('../models/Order.cjs');
const Wallet = require('../models/Wallet.cjs');
const Store = require('../models/Store.cjs');

// Hold payment in escrow
async function holdEscrow(orderId, amount, customerId) {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.escrow_amount = amount;
        order.escrow_status = 'held';
        await order.save();

        console.log(`🔒 Escrow held: KES ${amount} for order ${orderId}`);
        return { success: true };
    } catch (error) {
        console.error('Hold escrow error:', error);
        return { success: false, error: error.message };
    }
}

// Release escrow to vendor and platform (with 10% commission)
async function releaseEscrow(orderId) {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        if (order.escrow_status !== 'held') {
            throw new Error('Escrow not in held status');
        }

        // Calculate commission (10%)
        const commissionRate = 0.10;
        const platformCommission = parseFloat(order.escrow_amount) * commissionRate;
        const vendorAmount = parseFloat(order.escrow_amount) - platformCommission;

        // Get vendor wallet
        const store = await Store.findByPk(order.store_id);
        if (!store) throw new Error('Store not found');

        const vendorWallet = await Wallet.findOne({ where: { user_id: store.vendor_id } });
        if (vendorWallet) {
            vendorWallet.balance = parseFloat(vendorWallet.balance) + vendorAmount;
            vendorWallet.total_earned = parseFloat(vendorWallet.total_earned) + vendorAmount;
            await vendorWallet.save();
        }

        // Get platform wallet (Admin)
        const platformWallet = await Wallet.findOne({ where: { user_id: 'b3e9131a-23ae-4170-a874-a530d77dd05e' } });
        if (platformWallet) {
            platformWallet.balance = parseFloat(platformWallet.balance) + platformCommission;
            await platformWallet.save();
        }

        // Update order
        order.escrow_status = 'released';
        order.escrow_released_at = new Date();
        order.payment_status = 'paid';
        await order.save();

        console.log(`💰 Escrow released: KES ${vendorAmount} to vendor, KES ${platformCommission} to platform`);
        return { 
            success: true, 
            vendorAmount, 
            platformCommission 
        };
    } catch (error) {
        console.error('Release escrow error:', error);
        return { success: false, error: error.message };
    }
}

// Refund escrow to customer
async function refundEscrow(orderId) {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        if (order.escrow_status !== 'held') {
            throw new Error('Escrow not in held status');
        }

        // Refund to customer wallet
        const wallet = await Wallet.findOne({ where: { user_id: order.customer_id } });
        if (wallet) {
            wallet.balance = parseFloat(wallet.balance) + parseFloat(order.escrow_amount);
            await wallet.save();
        }

        order.escrow_status = 'refunded';
        await order.save();

        console.log(`↩️ Escrow refunded: KES ${order.escrow_amount} to customer`);
        return { success: true };
    } catch (error) {
        console.error('Refund escrow error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    holdEscrow,
    releaseEscrow,
    refundEscrow
};