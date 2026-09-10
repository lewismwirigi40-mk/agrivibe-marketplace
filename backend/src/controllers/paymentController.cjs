// backend/src/controllers/paymentController.cjs
const GuidePurchase = require('../models/GuidePurchase.cjs');
const Guide = require('../models/Guide.cjs');
const User = require('../models/User.cjs');
const emailService = require('../services/emailService.cjs');

// ============================================
// M-PESA CALLBACK (Safaricom calls this)
// ============================================
exports.mpesaCallback = async (req, res) => {
    try {
        console.log('📥 M-Pesa Callback received');
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
        
        const { Body } = req.body;
        const { stkCallback } = Body;
        const { ResultCode, ResultDesc, MerchantRequestID, CheckoutRequestID, CallbackMetadata } = stkCallback;

        // ✅ Find purchase by order number (MerchantRequestID)
        const purchase = await GuidePurchase.findOne({
            where: { order_number: MerchantRequestID }
        });

        if (!purchase) {
            console.error('❌ Purchase not found for order:', MerchantRequestID);
            return res.json({ ResultCode: 1, ResultDesc: 'Purchase not found' });
        }

        if (ResultCode === 0) {
            // ✅ Payment successful
            console.log('✅ Payment successful for order:', MerchantRequestID);
            
            // Extract M-Pesa receipt from metadata
           // Extract M-Pesa receipt from metadata
let mpesaReceipt = null;
if (CallbackMetadata && CallbackMetadata.Item) {
  const receiptItem = CallbackMetadata.Item.find(
    (item) => item.Name === 'MpesaReceiptNumber'
  );
  if (receiptItem) {
    mpesaReceipt = receiptItem.Value;
  }
}

            // ✅ Update purchase
            purchase.payment_status = 'completed';
            purchase.transaction_id = CheckoutRequestID;
            purchase.mpesa_code = mpesaReceipt;
            purchase.escrow_status = 'released';
            purchase.escrow_released_at = new Date();
            await purchase.save();

            // ✅ Update guide stats
            await Guide.increment('purchases', { where: { id: purchase.guide_id } });
            await Guide.increment('downloads', { where: { id: purchase.guide_id } });

            // ✅ Send email
            const guide = await Guide.findByPk(purchase.guide_id);
            const user = await User.findByPk(purchase.user_id);
            
            if (user && guide) {
                const downloadLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/guides/download/${purchase.download_token}`;
                
                await emailService.sendEmail(
                    user.email,
                    `📚 Your Guide: ${guide.title} is Ready for Download`,
                    `
                        <h2>Payment Successful!</h2>
                        <p>Dear ${user.first_name || 'Customer'},</p>
                        <p>Your purchase of <strong>"${guide.title}"</strong> is complete.</p>
                        <p><a href="${downloadLink}">Download your guide here</a></p>
                        <p>M-Pesa Receipt: ${mpesaReceipt || 'N/A'}</p>
                    `
                );
            }

            res.json({ ResultCode: 0, ResultDesc: 'Success' });
        } else {
            // ❌ Payment failed
            console.error('❌ Payment failed:', ResultDesc);
            purchase.payment_status = 'failed';
            await purchase.save();
            res.json({ ResultCode: 0, ResultDesc: 'Failed' });
        }
    } catch (error) {
        console.error('❌ M-Pesa callback error:', error);
        res.json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
    }
};

// ============================================
// CHECK PAYMENT STATUS (Frontend polls this)
// ============================================
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { purchase_id } = req.params;
        const user_id = req.user.id;

        const purchase = await GuidePurchase.findOne({
            where: { id: purchase_id, user_id }
        });

        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        res.json({
            success: true,
            payment_status: purchase.payment_status,
            download_token: purchase.payment_status === 'completed' ? purchase.download_token : null,
            guide: purchase.payment_status === 'completed' ? await Guide.findByPk(purchase.guide_id) : null
        });
    } catch (error) {
        console.error('Check payment status error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
};