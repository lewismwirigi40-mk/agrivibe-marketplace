const express = require('express');
const { createMpesaWebhook } = require('../../../integrations/mpesa/src/index.cjs');

const router = express.Router();

// Safaricom calls this URL after an STK Push completes. It must remain public
// and must not use the application's JWT authentication middleware.
router.post('/mpesa', (req, res) => {
    const webhook = createMpesaWebhook({
        passkey: process.env.MPESA_PASSKEY,
        shortcode: process.env.MPESA_SHORTCODE
    });

    const result = webhook.handleCallback(req.body);
    console.log('M-Pesa callback received:', result);

    return res.status(200).json(webhook.formatResponse());
});
// ============================================
// WhatsApp Webhook Verification
// ============================================

const VERIFY_TOKEN = "agrivibe_verify_token_2026";

// Meta calls this to verify the webhook
router.get('/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ WhatsApp webhook verified');
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// Receive incoming WhatsApp events
router.post('/whatsapp', (req, res) => {
    console.log('📩 WhatsApp Webhook Event:');
    console.log(JSON.stringify(req.body, null, 2));

    res.sendStatus(200);
});

module.exports = router;
