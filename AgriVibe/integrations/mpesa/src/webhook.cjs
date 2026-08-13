const crypto = require('crypto');

class MpesaWebhook {
    constructor(config) {
        this.passkey = config.passkey;
        this.shortcode = config.shortcode;
    }

    // Verify webhook signature
    verifySignature(signature, body) {
        try {
            const expected = crypto
                .createHmac('sha256', this.passkey)
                .update(JSON.stringify(body))
                .digest('hex');
            
            return signature === expected;
        } catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }

    // Process webhook callback
    handleCallback(reqBody) {
        try {
            const { Body } = reqBody;
            
            if (!Body || !Body.stkCallback) {
                return {
                    success: false,
                    error: 'Invalid callback structure'
                };
            }

            const { stkCallback } = Body;
            const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

            // Success
            if (ResultCode === 0 && CallbackMetadata) {
                const items = {};
                CallbackMetadata.Item.forEach(item => {
                    items[item.Name] = item.Value;
                });

                return {
                    success: true,
                    resultCode: ResultCode,
                    resultDesc: ResultDesc,
                    mpesaReceipt: items.MpesaReceiptNumber,
                    amount: items.Amount,
                    phoneNumber: items.PhoneNumber,
                    transactionDate: items.TransactionDate,
                    merchantRequestId: stkCallback.MerchantRequestID,
                    checkoutRequestId: stkCallback.CheckoutRequestID
                };
            }

            // Failure
            return {
                success: false,
                resultCode: ResultCode,
                resultDesc: ResultDesc,
                merchantRequestId: stkCallback.MerchantRequestID,
                checkoutRequestId: stkCallback.CheckoutRequestID
            };

        } catch (error) {
            console.error('Webhook processing error:', error);
            return {
                success: false,
                error: 'Failed to process webhook'
            };
        }
    }

    // Format response for Safaricom
    formatResponse() {
        return {
            ResponseCode: '0',
            ResponseDesc: 'Success'
        };
    }
}

module.exports = MpesaWebhook;