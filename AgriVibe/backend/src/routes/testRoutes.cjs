const express = require('express');
const router = express.Router();
const { sendEmail, sendDeliveryCodeEmail, sendOrderConfirmationEmail } = require('../services/emailService.cjs');
// Test WhatsApp endpoint
router.post('/whatsapp', async (req, res) => {
    try {
        const { to, message } = req.body;
        const { sendWhatsAppMessage } = require('../services/whatsappService.cjs');
        
        const result = await sendWhatsAppMessage(to || '254769074319', message || 'Hello from AgriVibe! 🌾');
        
        res.json({
            success: true,
            result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Test email endpoint
router.post('/email', async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        
        const result = await sendEmail(
            to || 'aurelia80@ethereal.email',
            subject || 'Test Email from AgriVibe',
            `<h1>✅ Test Successful!</h1><p>${message || 'Your email service is working!'}</p>`
        );
        
        res.json({
            success: true,
            message: 'Email sent!',
            previewUrl: result.previewUrl
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test delivery code email
router.post('/test-delivery-code', async (req, res) => {
    try {
        const { to, orderNumber, code } = req.body;
        
        const result = await sendDeliveryCodeEmail(
            to || 'aurelia80@ethereal.email',
            orderNumber || 'ORD-TEST-001',
            code || '123456'
        );
        
        res.json({
            success: true,
            message: 'Delivery code email sent!',
            previewUrl: result.previewUrl
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;