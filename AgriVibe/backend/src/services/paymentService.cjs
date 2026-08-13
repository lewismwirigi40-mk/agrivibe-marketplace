const { createMpesaClient } = require('../../../integrations/mpesa/src/index.cjs');

let mpesaClient = null;

function initMpesa(config) {
    mpesaClient = createMpesaClient({
        consumerKey: config.MPESA_CONSUMER_KEY,
        consumerSecret: config.MPESA_CONSUMER_SECRET,
        passkey: config.MPESA_PASSKEY,
        shortcode: config.MPESA_SHORTCODE,
        environment: config.MPESA_ENVIRONMENT || 'sandbox',
        callbackUrl: config.MPESA_CALLBACK_URL
    });
    return mpesaClient;
}

function getMpesaClient() {
    if (!mpesaClient) {
        throw new Error('M-Pesa not initialized. Call initMpesa() first.');
    }
    return mpesaClient;
}

// Send STK Push
async function sendMpesaPayment(phoneNumber, amount, orderNumber) {
    try {
        console.log("========== PAYMENT SERVICE ==========");
        console.log("Phone:", phoneNumber);
        console.log("Amount:", amount);
        console.log("Order:", orderNumber);

        const client = getMpesaClient();

        console.log("Client:", client);
        console.log("stkPush type:", typeof client.stkPush);

        let formattedPhone = phoneNumber;

        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('+254')) {
            formattedPhone = formattedPhone.substring(1);
        }

        const result = await client.stkPush(
            formattedPhone,
            amount,
            orderNumber,
            'AgriVibe Payment'
        );

        return result;
    } catch (error) {
        console.error('M-Pesa payment error:', error);
        return {
            success: false,
            error: 'Payment request failed'
        };
    }
}
// Check payment status
async function checkMpesaStatus(checkoutRequestId) {
    try {
        const client = getMpesaClient();
        return await client.queryStatus(checkoutRequestId);
    } catch (error) {
        console.error('M-Pesa status check error:', error);
        return {
            success: false,
            error: 'Status check failed'
        };
    }
}

module.exports = {
    initMpesa,
    getMpesaClient,
    sendMpesaPayment,
    checkMpesaStatus
};