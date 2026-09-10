const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// ✅ M-Pesa callback (public - Safaricom calls this)
router.post('/mpesa/callback', paymentController.mpesaCallback);

// ✅ Check payment status (authenticated)
router.get('/status/:purchase_id', authMiddleware, paymentController.checkPaymentStatus);

module.exports = router;