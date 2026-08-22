const { sendMpesaPayment, checkMpesaStatus } = require('../services/paymentService.cjs');

// Initiate M-Pesa Payment
exports.initiateMpesaPayment = async (req, res) => {
    try {
        const { phoneNumber, amount, orderId } = req.body;

        if (!phoneNumber || !amount || !orderId) {
            return res.status(400).json({ 
                error: 'Phone number, amount, and order ID are required' 
            });
        }

        const result = await sendMpesaPayment(phoneNumber, amount, orderId);

        if (result.success) {
            res.json({
                message: 'Payment initiated successfully',
                merchantRequestId: result.merchantRequestId,
                checkoutRequestId: result.checkoutRequestId,
                responseCode: result.responseCode,
                responseDescription: result.responseDescription,
                customerMessage: result.customerMessage
            });
        } else {
            res.status(400).json({
                error: result.error || 'Payment initiation failed'
            });
        }

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

// Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { checkoutRequestId } = req.params;

        if (!checkoutRequestId) {
            return res.status(400).json({ error: 'Checkout Request ID required' });
        }

        const result = await checkMpesaStatus(checkoutRequestId);

        if (result.success) {
            res.json({
                status: 'completed',
                resultCode: result.resultCode,
                resultDesc: result.resultDesc,
                mpesaReceipt: result.mpesaReceiptNumber,
                amount: result.amount
            });
        } else {
            res.status(400).json({
                status: 'failed',
                error: result.error || 'Status check failed'
            });
        }

    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
};