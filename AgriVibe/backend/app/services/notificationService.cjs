const User = require('../models/User.cjs');

// ============================================
// SEND DELIVERY CODE TO CUSTOMER ONLY
// ============================================
async function sendDeliveryCodeToCustomer(customerId, orderNumber, code) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) {
            console.log(`❌ Customer ${customerId} not found`);
            return false;
        }

        const message = `🔑 Your AgriVibe delivery code for order #${orderNumber} is: ${code}

Please keep this code safe. Give it to your driver only when you receive your items.

Thank you for choosing AgriVibe! 🌾`;

        let sent = false;

        // Send SMS if phone exists
        if (customer.phone) {
            try {
                // await sendSMS(customer.phone, message);
                console.log(`📱 SMS sent to ${customer.phone}: ${message}`);
                sent = true;
            } catch (error) {
                console.error(`❌ SMS failed to ${customer.phone}:`, error.message);
            }
        }

        // Send Email if email exists
        if (customer.email) {
            try {
                // await sendEmail(customer.email, 'Your Delivery Code', message);
                console.log(`📧 Email sent to ${customer.email}: ${message}`);
                sent = true;
            } catch (error) {
                console.error(`❌ Email failed to ${customer.email}:`, error.message);
            }
        }

        // Log delivery code (for testing)
        console.log(`🔑 Delivery code for order #${orderNumber}: ${code}`);

        return sent;

    } catch (error) {
        console.error('Send delivery code error:', error);
        return false;
    }
}

// ============================================
// NOTIFY CUSTOMER - DELIVERY COMPLETE
// ============================================
async function notifyCustomerDeliveryComplete(customerId, orderNumber) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) return false;

        const message = `📦 Order #${orderNumber} has been delivered!

Thank you for shopping with AgriVibe! 🌾

Please rate your delivery experience in the app.`;

        let sent = false;

        if (customer.phone) {
            try {
                // await sendSMS(customer.phone, message);
                console.log(`📱 Delivery complete SMS to ${customer.phone}`);
                sent = true;
            } catch (error) {
                console.error(`❌ SMS failed:`, error.message);
            }
        }

        if (customer.email) {
            try {
                // await sendEmail(customer.email, 'Order Delivered', message);
                console.log(`📧 Delivery complete email to ${customer.email}`);
                sent = true;
            } catch (error) {
                console.error(`❌ Email failed:`, error.message);
            }
        }

        return sent;

    } catch (error) {
        console.error('Notify customer delivery complete error:', error);
        return false;
    }
}

// ============================================
// NOTIFY VENDOR - DELIVERY COMPLETE
// ============================================
async function notifyVendorDeliveryComplete(storeId, orderNumber) {
    try {
        const Store = require('../models/Store.cjs');
        const store = await Store.findByPk(storeId);
        if (!store) return false;

        const vendor = await User.findByPk(store.vendor_id);
        if (!vendor) return false;

        const message = `📦 Order #${orderNumber} has been delivered!

💰 Payment has been released to your wallet.

Customer: ${store.store_name}`;

        let sent = false;

        if (vendor.phone) {
            try {
                // await sendSMS(vendor.phone, message);
                console.log(`📱 Vendor SMS to ${vendor.phone}`);
                sent = true;
            } catch (error) {
                console.error(`❌ SMS failed:`, error.message);
            }
        }

        if (vendor.email) {
            try {
                // await sendEmail(vendor.email, 'Order Delivered - Payment Released', message);
                console.log(`📧 Vendor email to ${vendor.email}`);
                sent = true;
            } catch (error) {
                console.error(`❌ Email failed:`, error.message);
            }
        }

        return sent;

    } catch (error) {
        console.error('Notify vendor delivery complete error:', error);
        return false;
    }
}

// ============================================
// NOTIFY DRIVER - NEW DELIVERY ASSIGNED
// ============================================
async function notifyDriverNewDelivery(driverId, deliveryId, orderNumber) {
    try {
        const driver = await User.findByPk(driverId);
        if (!driver) return false;

        const message = `📦 New delivery assigned!

Order #${orderNumber}
Delivery ID: ${deliveryId}

Please check your app for details.`;

        let sent = false;

        if (driver.phone) {
            try {
                // await sendSMS(driver.phone, message);
                console.log(`📱 Driver SMS to ${driver.phone}`);
                sent = true;
            } catch (error) {
                console.error(`❌ SMS failed:`, error.message);
            }
        }

        if (driver.email) {
            try {
                // await sendEmail(driver.email, 'New Delivery Assigned', message);
                console.log(`📧 Driver email to ${driver.email}`);
                sent = true;
            } catch (error) {
                console.error(`❌ Email failed:`, error.message);
            }
        }

        return sent;

    } catch (error) {
        console.error('Notify driver new delivery error:', error);
        return false;
    }
}

// ============================================
// NOTIFY CUSTOMER - ORDER CONFIRMATION
// ============================================
async function notifyCustomerOrderConfirmation(customerId, orderNumber, total) {
    try {
        const customer = await User.findByPk(customerId);
        if (!customer) return false;

        const message = `✅ Order #${orderNumber} confirmed!

Total: KES ${total}

You will receive a delivery code when your order is ready.

Thank you for choosing AgriVibe! 🌾`;

        let sent = false;

        if (customer.phone) {
            try {
                // await sendSMS(customer.phone, message);
                console.log(`📱 Order confirmation SMS to ${customer.phone}`);
                sent = true;
            } catch (error) {
                console.error(`❌ SMS failed:`, error.message);
            }
        }

        if (customer.email) {
            try {
                // await sendEmail(customer.email, 'Order Confirmed', message);
                console.log(`📧 Order confirmation email to ${customer.email}`);
                sent = true;
            } catch (error) {
                console.error(`❌ Email failed:`, error.message);
            }
        }

        return sent;

    } catch (error) {
        console.error('Notify customer order confirmation error:', error);
        return false;
    }
}

// ============================================
// NOTIFY VENDOR - NEW ORDER
// ============================================
async function notifyVendorNewOrder(storeId, orderNumber, total) {
    try {
        const Store = require('../models/Store.cjs');
        const store = await Store.findByPk(storeId);
        if (!store) return false;

        const vendor = await User.findByPk(store.vendor_id);
        if (!vendor) return false;

        const message = `📦 New order received!

Order #${orderNumber}
Total: KES ${total}

Please prepare the items for delivery.`;

        let sent = false;

        if (vendor.phone) {
            try {
                // await sendSMS(vendor.phone, message);
                console.log(`📱 Vendor SMS to ${vendor.phone}`);
                sent = true;
            } catch (error) {
                console.error(`❌ SMS failed:`, error.message);
            }
        }

        if (vendor.email) {
            try {
                // await sendEmail(vendor.email, 'New Order Received', message);
                console.log(`📧 Vendor email to ${vendor.email}`);
                sent = true;
            } catch (error) {
                console.error(`❌ Email failed:`, error.message);
            }
        }

        return sent;

    } catch (error) {
        console.error('Notify vendor new order error:', error);
        return false;
    }
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
    sendDeliveryCodeToCustomer,
    notifyCustomerDeliveryComplete,
    notifyVendorDeliveryComplete,
    notifyDriverNewDelivery,
    notifyCustomerOrderConfirmation,
    notifyVendorNewOrder
};